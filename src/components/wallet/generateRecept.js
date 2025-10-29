// receiptGenerator.js
// Utility file for generating receipt HTML

import {Platform} from 'react-native';

/**
 * Generates a formatted HTML receipt for transactions
 * @param {Object} userData - Transaction data object
 * @param {Function} formatTime - Function to format timestamps
 * @param {string} token - Optional token string
 * @returns {string} HTML string for the receipt
 */
export const generateReceiptHTML = (userData, formatTime, token = '') => {
  // Validate formatTime function
  if (typeof formatTime !== 'function') {
    formatTime = timestamp => {
      if (!timestamp) return 'N/A';
      try {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      } catch (error) {
        return timestamp.toString();
      }
    };
  }

  const transactionDate = userData?.updatedAt
    ? formatTime(userData?.updatedAt)
    : formatTime(userData?.flutterwaveResponse?.transaction_date);

  const amount = userData?.amount
    ? `₦${parseFloat(userData?.amount / 100)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
    : `₦${parseFloat(userData?.flutterwaveResponse?.amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

  const description =
    userData?.description ||
    userData?.flutterwaveResponse?.product ||
    'Transaction';

  const status = userData?.status || userData?.transaction?.status || 'Unknown';

  const id = userData?.id || userData?.transaction?.id || 'Unknown';

  const meterToken =
    userData?.metadata?.token || token?.replace('/PIN', '') || '';

  const meterNumber = userData?.metadata?.id || '';

  const rechargeToken = userData?.flutterwaveResponse?.extra || '';

  // Additional metadata fields
  const customerName = userData?.metadata?.name || '';
  const customerAddress = userData?.metadata?.address || '';
  const disco = userData?.metadata?.disco || '';
  const units = userData?.metadata?.units || '';
  const receiptNo = userData?.metadata?.receiptNo || '';
  const vendRef = userData?.metadata?.vendRef || '';
  const tariffClass = userData?.metadata?.tariffClass || '';
  const assetProvider = userData?.metadata?.assetProvider || '';
  const charges = userData?.metadata?.charges || '0';
  const responseMessage = userData?.metadata?.responseMessage || '';

  const appName = Platform.OS === 'ios' ? 'BlowPay' : 'BillsByBlowMoney';
  const appInitials = Platform.OS === 'ios' ? 'BP' : 'BM';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BlowMoney Receipt</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .receipt-container {
            max-width: 600px;
            width: 100%;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            animation: slideUp 0.5s ease-out;
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .header {
            background: linear-gradient(135deg, #FF114A 0%, #FF5C7C 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          .logo-container {
            position: relative;
            z-index: 1;
            margin-bottom: 15px;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }
          
          .logo-text {
            color: #FF114A;
            font-weight: 900;
            font-size: 32px;
            letter-spacing: -1px;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
            position: relative;
            z-index: 1;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          
          .status-badge {
            display: inline-block;
            margin-top: 15px;
            padding: 8px 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            backdrop-filter: blur(10px);
          }
          
          .status-success {
            background: rgba(16, 185, 129, 0.9);
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .amount-section {
            text-align: center;
            padding: 25px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            margin-bottom: 25px;
          }
          
          .amount-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .amount-value {
            font-size: 42px;
            font-weight: 800;
            color: #FF114A;
            letter-spacing: -1px;
          }
          
          .info-section {
            margin-bottom: 25px;
          }
          
          .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #f0f0f0;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;
            align-items: flex-start;
          }
          
          .info-item:last-child {
            border-bottom: none;
          }
          
          .info-label {
            color: #666;
            font-size: 14px;
            font-weight: 500;
            flex-shrink: 0;
            margin-right: 15px;
          }
          
          .info-value {
            font-weight: 600;
            font-size: 14px;
            color: #333;
            text-align: right;
            word-break: break-word;
          }
          
          .token-box {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border-left: 5px solid #F59E0B;
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
          }
          
          .token-label {
            font-size: 12px;
            color: #92400E;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          
          .token-value {
            font-size: 24px;
            font-weight: 800;
            color: #92400E;
            letter-spacing: 2px;
            word-break: break-all;
            font-family: 'Courier New', monospace;
          }
          
          .units-box {
            background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
            border-left: 5px solid #3B82F6;
            padding: 15px 20px;
            margin: 15px 0;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .units-label {
            font-size: 14px;
            color: #1E40AF;
            font-weight: 600;
          }
          
          .units-value {
            font-size: 20px;
            font-weight: 800;
            color: #1E40AF;
          }
          
          .address-box {
            background: #F9FAFB;
            padding: 15px;
            border-radius: 10px;
            margin: 15px 0;
            border: 1px solid #E5E7EB;
          }
          
          .address-label {
            font-size: 12px;
            color: #6B7280;
            font-weight: 600;
            margin-bottom: 5px;
          }
          
          .address-value {
            font-size: 13px;
            color: #374151;
            line-height: 1.6;
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 25px 0;
          }
          
          .footer {
            text-align: center;
            padding: 20px;
            background: #F9FAFB;
            border-top: 1px solid #E5E7EB;
          }
          
          .footer p {
            font-size: 12px;
            color: #9CA3AF;
            margin: 5px 0;
          }
          
          .footer-logo {
            font-weight: 700;
            color: #FF114A;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .receipt-container {
              box-shadow: none;
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>${appName}</h1>
            <p>Transaction Receipt</p>
            <div class="status-badge ${
              status === 'completed' ? 'status-success' : ''
            }">
              ${status}
            </div>
          </div>
          
          <div class="content">
            <div class="amount-section">
              <div class="amount-label">Total Amount</div>
              <div class="amount-value">${amount}</div>
            </div>
            
            ${
              customerName
                ? `
            <div class="info-section">
              <div class="section-title">Customer Information</div>
              <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">${customerName}</span>
              </div>
              ${
                meterNumber
                  ? `
              <div class="info-item">
                <span class="info-label">Meter Number</span>
                <span class="info-value">${meterNumber}</span>
              </div>
              `
                  : ''
              }
              ${
                tariffClass && tariffClass !== 'Not Available'
                  ? `
              <div class="info-item">
                <span class="info-label">Tariff Class</span>
                <span class="info-value">${tariffClass}</span>
              </div>
              `
                  : ''
              }
            </div>
            `
                : ''
            }
            
            ${
              customerAddress
                ? `
            <div class="address-box">
              <div class="address-label">Service Address</div>
              <div class="address-value">${customerAddress}</div>
            </div>
            `
                : ''
            }
            
            ${
              meterToken
                ? `
            <div class="token-box">
              <div class="token-label">⚡ Meter Token</div>
              <div class="token-value">${meterToken}</div>
            </div>
            `
                : ''
            }
            
            ${
              units
                ? `
            <div class="units-box">
              <span class="units-label">Energy Units</span>
              <span class="units-value">${units} kWh</span>
            </div>
            `
                : ''
            }
            
            ${
              rechargeToken
                ? `
            <div class="token-box">
              <div class="token-label">Recharge Token</div>
              <div class="token-value">${rechargeToken}</div>
            </div>
            `
                : ''
            }
            
            <div class="divider"></div>
            
            <div class="info-section">
              <div class="section-title">Transaction Details</div>
              <div class="info-item">
                <span class="info-label">Description</span>
                <span class="info-value">${description}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Transaction ID</span>
                <span class="info-value">${id}</span>
              </div>
              ${
                receiptNo
                  ? `
              <div class="info-item">
                <span class="info-label">Receipt No</span>
                <span class="info-value">${receiptNo}</span>
              </div>
              `
                  : ''
              }
              ${
                vendRef
                  ? `
              <div class="info-item">
                <span class="info-label">Vend Reference</span>
                <span class="info-value">${vendRef}</span>
              </div>
              `
                  : ''
              }
              <div class="info-item">
                <span class="info-label">Date & Time</span>
                <span class="info-value">${transactionDate}</span>
              </div>
              ${
                disco
                  ? `
              <div class="info-item">
                <span class="info-label">Distribution Company</span>
                <span class="info-value">${disco}</span>
              </div>
              `
                  : ''
              }
              ${
                assetProvider
                  ? `
              <div class="info-item">
                <span class="info-label">Asset Provider</span>
                <span class="info-value">${assetProvider}</span>
              </div>
              `
                  : ''
              }
              ${
                charges !== '0'
                  ? `
              <div class="info-item">
                <span class="info-label">Service Charges</span>
                <span class="info-value">₦${parseFloat(charges).toFixed(
                  2,
                )}</span>
              </div>
              `
                  : ''
              }
              ${
                responseMessage
                  ? `
              <div class="info-item">
                <span class="info-label">Status Message</span>
                <span class="info-value">${responseMessage}</span>
              </div>
              `
                  : ''
              }
            </div>
          </div>
          
          <div class="footer">
            <p><span class="footer-logo">BlowMoney</span> • Digital Payment Solutions</p>
            <p>Thank you for using our service!</p>
            <p style="margin-top: 10px; font-size: 11px;">Keep this receipt for your records</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to format currency
export const formatCurrency = amount => {
  return `₦${parseFloat(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

// Export default
export default generateReceiptHTML;
