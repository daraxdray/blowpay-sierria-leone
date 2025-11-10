// receiptGenerator.js
// Fixed version for Android PDF generation

import {Platform} from 'react-native';

/**
 * Generates a formatted HTML receipt for transactions
 * Optimized for PDF generation on Android devices
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
    ? `NGN ${parseFloat(userData?.amount / 100)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
    : `NGN ${parseFloat(userData?.flutterwaveResponse?.amount)
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

  const appName = Platform.OS === 'ios' ? 'BlowPay' : 'Blowpay';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transaction Receipt</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, Helvetica, sans-serif;
            background: #ffffff;
            padding: 20px;
            color: #333;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .receipt-container {
            max-width: 600px;
            width: 100%;
            background: white;
            border: 2px solid #e0e0e0;
            margin: 0 auto;
          }
          
          .header {
            background: #FF114A;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 4px solid #d00d3c;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .header p {
            font-size: 14px;
            margin-bottom: 15px;
          }
          
          .status-badge {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(255, 255, 255, 0.3);
            border: 2px solid white;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .content {
            padding: 25px 20px;
          }
          
          .amount-section {
            text-align: center;
            padding: 25px;
            background: #f5f5f5;
            border: 2px solid #e0e0e0;
            margin-bottom: 25px;
          }
          
          .amount-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 1px;
          }
          
          .amount-value {
            font-size: 36px;
            font-weight: bold;
            color: #FF114A;
          }
          
          .info-section {
            margin-bottom: 25px;
          }
          
          .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e0e0e0;
          }
          
          .info-item {
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .info-item:last-child {
            border-bottom: none;
          }
          
          .info-label {
            color: #666;
            font-size: 12px;
            font-weight: bold;
            display: block;
            margin-bottom: 4px;
          }
          
          .info-value {
            font-weight: normal;
            font-size: 14px;
            color: #333;
            word-wrap: break-word;
          }
          
          .token-box {
            background: #FEF3C7;
            border-left: 5px solid #F59E0B;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #F59E0B;
          }
          
          .token-label {
            font-size: 11px;
            color: #92400E;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            display: block;
          }
          
          .token-value {
            font-size: 18px;
            font-weight: bold;
            color: #92400E;
            letter-spacing: 2px;
            word-wrap: break-word;
            font-family: monospace;
          }
          
          .units-box {
            background: #DBEAFE;
            border-left: 5px solid #3B82F6;
            padding: 15px 20px;
            margin: 15px 0;
            border: 1px solid #3B82F6;
          }
          
          .units-label {
            font-size: 12px;
            color: #1E40AF;
            font-weight: bold;
            display: inline-block;
            margin-right: 15px;
          }
          
          .units-value {
            font-size: 18px;
            font-weight: bold;
            color: #1E40AF;
            display: inline-block;
          }
          
          .address-box {
            background: #F9FAFB;
            padding: 15px;
            margin: 15px 0;
            border: 1px solid #E5E7EB;
          }
          
          .address-label {
            font-size: 11px;
            color: #6B7280;
            font-weight: bold;
            margin-bottom: 8px;
            display: block;
            text-transform: uppercase;
          }
          
          .address-value {
            font-size: 13px;
            color: #374151;
            line-height: 1.6;
          }
          
          .divider {
            height: 1px;
            background: #ddd;
            margin: 25px 0;
          }
          
          .footer {
            text-align: center;
            padding: 20px;
            background: #F9FAFB;
            border-top: 2px solid #e0e0e0;
          }
          
          .footer p {
            font-size: 11px;
            color: #666;
            margin: 5px 0;
          }
          
          .footer-logo {
            font-weight: bold;
            color: #FF114A;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>${appName}</h1>
            <p>Transaction Receipt</p>
            <div class="status-badge">${status}</div>
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
              <div class="token-label">METER TOKEN</div>
              <div class="token-value">${meterToken}</div>
            </div>
            `
                : ''
            }
            
            ${
              units
                ? `
            <div class="units-box">
              <span class="units-label">Energy Units:</span>
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
                <span class="info-label">Date &amp; Time</span>
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
                <span class="info-value">NGN ${parseFloat(charges).toFixed(
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
            <p><span class="footer-logo">BlowMoney</span> - Digital Payment Solutions</p>
            <p>Thank you for using our service!</p>
            <p style="margin-top: 10px;">Keep this receipt for your records</p>
            <p style="margin-top: 15px; font-size: 10px;">Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to format currency
export const formatCurrency = amount => {
  return `NGN ${parseFloat(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

export default generateReceiptHTML;
