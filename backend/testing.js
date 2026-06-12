/**
 * Automated REST API Verification Script
 * Uses Node.js native fetch API (Node 18+) to run E2E integration checks on backend routes.
 * 
 * Usage:
 * 1. Start the backend: npm run start (in backend/)
 * 2. Run this test: node testing.js
 */

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('      REST API INTEGRATION TESTING SUITE            ');
  console.log('====================================================\n');

  const results = [];
  let adminToken = '';
  let testOrderId = null;

  // Test Helper
  const assertTest = (name, condition, details = '') => {
    if (condition) {
      console.log(`[PASS] ${name}`);
      results.push({ name, status: 'PASS', details });
    } else {
      console.error(`[FAIL] ${name}`);
      results.push({ name, status: 'FAIL', details });
    }
  };

  try {
    // 1. Check Root Endpoint
    console.log('Testing connection to API server...');
    const rootRes = await fetch('http://localhost:5000/');
    const rootData = await rootRes.json();
    assertTest('Root Server Status', rootData.success === true, `Message: ${rootData.message}`);

    // 2. Admin Authentication - Invalid Credentials
    console.log('\nTesting Admin Authentication (Negative case)...');
    const loginFailRes = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@restaurant.com', password: 'WrongPassword' })
    });
    assertTest(
      'Admin Login - Reject Invalid Password',
      loginFailRes.status === 401,
      `Status code: ${loginFailRes.status}`
    );

    // 3. Admin Authentication - Success
    console.log('\nTesting Admin Authentication (Positive case)...');
    const loginSuccessRes = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@restaurant.com', password: 'AdminPassword123' })
    });
    const loginData = await loginSuccessRes.json();
    adminToken = loginData.token;
    assertTest(
      'Admin Login - Generate JWT Token',
      loginSuccessRes.status === 200 && adminToken !== undefined,
      `Token: ${adminToken ? adminToken.slice(0, 15) + '...' : 'None'}`
    );

    // 4. Admin Dashboard Stats
    console.log('\nTesting Protected Admin Dashboard Stats...');
    const statsRes = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    assertTest(
      'Fetch Admin Stats (Authorized)',
      statsRes.status === 200 && statsData.success === true,
      `Pending Orders: ${statsData.stats?.pendingOrders || 0}`
    );

    // 5. Unauthenticated Dashboard Stats block
    console.log('\nTesting Admin Dashboard Stats without credentials...');
    const statsBlockRes = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
      method: 'GET'
    });
    assertTest(
      'Fetch Admin Stats (Block Unauthorized)',
      statsBlockRes.status === 401,
      `Status code: ${statsBlockRes.status}`
    );

    // 6. Public Menu Fetch
    console.log('\nTesting Public Menu Catalog...');
    const menuRes = await fetch(`${BASE_URL}/menu`);
    const menuData = await menuRes.json();
    assertTest(
      'Retrieve Food Menu',
      menuRes.status === 200 && menuData.menu.length > 0,
      `Total menu items: ${menuData.menu?.length || 0}`
    );

    // 7. Transactional Customer Checkout
    console.log('\nTesting Transactional Customer Order Checkout...');
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Test QA User',
        mobile_number: '9876543210',
        table_number: '12',
        items: [
          { menu_item_id: 1, quantity: 2 }, // Paneer Tikka
          { menu_item_id: 21, quantity: 1 } // Fresh Lime Soda
        ]
      })
    });
    const orderData = await orderRes.json();
    testOrderId = orderData.orderId;
    assertTest(
      'Place Customer Order',
      orderRes.status === 201 && testOrderId !== null,
      `Placed Order ID: ${testOrderId}, Total: $${orderData.totalAmount || 0}`
    );

    // 8. Order Tracking
    console.log('\nTesting Order Tracking Details...');
    const trackRes = await fetch(`${BASE_URL}/orders/${testOrderId}`);
    const trackData = await trackRes.json();
    assertTest(
      'Track Order by ID',
      trackRes.status === 200 && trackData.order.customer_name === 'Test QA User',
      `Logged Name: ${trackData.order?.customer_name}`
    );

    // 9. Admin Update Order Status
    console.log('\nTesting Status Transition Flow...');
    const statusUpdateRes = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Preparing' })
    });
    const statusUpdateData = await statusUpdateRes.json();
    assertTest(
      'Admin Transition Status to Preparing',
      statusUpdateRes.status === 200 && statusUpdateData.success === true,
      `Server response message: ${statusUpdateData.message}`
    );

    // Verify change reflected
    const trackAfterRes = await fetch(`${BASE_URL}/orders/${testOrderId}`);
    const trackAfterData = await trackAfterRes.json();
    assertTest(
      'Confirm Reflected Status Update',
      trackAfterData.order.status === 'Preparing',
      `Current Status: ${trackAfterData.order.status}`
    );

  } catch (error) {
    console.error('Fatal testing exception occurred:', error.message);
    results.push({ name: 'System Testing Loop', status: 'CRASH', details: error.message });
  }

  // Summary Table Print
  console.log('\n====================================================');
  console.log('                  VERIFICATION SUMMARY              ');
  console.log('====================================================');
  console.table(results);
  console.log('====================================================');
}

runTests();
