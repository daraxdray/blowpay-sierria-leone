import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
  Share,
  PermissionsAndroid,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import tw from 'twrnc';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomButton } from '../../global/components';
import { BLACK, WHITE } from '../../global/theme';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useGetTransaction, useGetTxToken } from '../../hooks/transactions.hook';
import Clipboard from '@react-native-clipboard/clipboard';
import Loader from './Loader';
import { formatTime } from '../../constants/data/Transaction';
import { navigate } from '../../routes/root/RootNavigation';
import RNFS from 'react-native-fs';
// Add the following imports for PDF generation
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import AppConstant from '../../constants/data/appConstant';
import Appicon from '../../../assets/svgs/logo_ios.svg';
import Appicon2 from '../../../assets/svgs/logo.svg';
// import ReactNativeBlobUtil from 'react-native-blob-util';

const TransactionDetails = ({ closeModal, transactionId }) => {
  const { data, status } = useGetTransaction(transactionId);
  const { mutate, status: gettingToken } = useGetTxToken();
  const userData = data?.data || {};
  const message = data?.message;
  const [token, setToken] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareFormat, setShareFormat] = useState('pdf'); // 'pdf' or 'text'
  const receiptRef = useRef(null);
  // State for token fetch time
  const [tokenFetchTime, setTokenFetchTime] = useState(null);
  
  // Update token fetch time when token changes or is fetched
  useEffect(() => {
    if (token && !tokenFetchTime) {
      setTokenFetchTime(new Date().toLocaleString());
    }
  }, [token]);
  const copyToClipboard = text => {
    Clipboard.setString(text);
    Toast.show({
      text1: 'Copied',
      text2: text+' has been copied to clipboard',
    });
  };

  useEffect(() => {
    console.log(data?.data);
  }, [data?.data]);

  const done = () => {
    closeModal();
  };

  const handleSwipeDown = ({ nativeEvent }) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };

  const requestNewToken = () => {
    mutate(transactionId, {
      onSuccess: (suc) => {
        console.log('====================================');
        console.log(suc?.data?.result);
        if (suc?.data?.result?.status) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Token fetched.',

          });
          setToken(suc?.data?.result?.data?.token);
          return;
        } else {
          setToken(null);
        }
      },
      onError: (err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      }
    });
  };

  const gotoService = (data) => {
    switch (data?.description) {
      case "Transfer":
        navigate('SendBills', data);
        return;
      case "Electricity":
        navigate("");
        return;
      default:
        navigate("");
    }
  };

  // Function to request storage permissions (for Android)
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'BlowMoney needs access to your storage to save receipts',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Create HTML for PDF Receipt
  const generateReceiptHTML = () => {
    const transactionDate = userData?.updatedAt
      ? formatTime(userData?.updatedAt)
      : formatTime(userData?.flutterwaveResponse?.transaction_date);

    const amount = userData?.amount
      ? `₦${parseFloat(userData?.amount / 100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
      : `₦${parseFloat(userData?.flutterwaveResponse?.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

    const description = userData?.description || userData?.flutterwaveResponse?.product || 'Transaction';
    const status = userData?.status || userData?.transaction?.status || 'Unknown';
    const id = userData?.id || userData?.transaction?.id || 'Unknown';
    const meterToken = userData?.metadata?.token || token?.replace("/PIN", '') || '';
    const meterNumber = userData?.metadata?.meterno || '';
    const rechargeToken = userData?.flutterwaveResponse?.extra || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>BlowMoney Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .receipt {
              max-width: 100%;
              margin: 0 auto;
              border: 1px solid #ddd;
              border-radius: 10px;
              overflow: hidden;
            }
            .header {
              background-color: #FF114A;
              color: white;
              padding: 15px;
              text-align: center;
            }
            .content {
              padding: 20px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .label {
              color: #666;
              font-size: 14px;
            }
            .value {
              font-weight: bold;
              font-size: 16px;
            }
            .token {
              background-color: #FEF3C7;
              border-left: 4px solid #F59E0B;
              padding: 10px;
              margin: 15px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div style="text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: 10px;">
                <div style="width: 60px; height: 60px; background-color: #FF114A; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                  <div style="color: black; font-weight: bold; font-size: 24px;">
                    ${Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'BP' : 'BM'}
                  </div>
                </div>
              </div>
              <h2 style="color: red;">${Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'BlowPay' : 'BillsByBlowMoney'}</h2>
              <p>Transaction Receipt</p>
            </div>
            <div class="content">
              <div class="item">
                <span class="label">Amount</span>
                <span class="value">${amount}</span>
              </div>
              <div class="item">
                <span class="label">Description</span>
                <span class="value">${description}</span>
              </div>
              <div class="item">
                <span class="label">Status</span>
                <span class="value">${status}</span>
              </div>
              <div class="item">
                <span class="label">Transaction ID</span>
                <span class="value">${id}</span>
              </div>
              <div class="item">
                <span class="label">Date</span>
                <span class="value">${transactionDate}</span>
              </div>
              ${meterNumber ? `
              <div class="item">
                <span class="label">Meter Number</span>
                <span class="value">${meterNumber}</span>
              </div>
              ` : ''}
              ${meterToken ? `
              <div class="token">
                <span>Token: ${meterToken}</span>
              </div>
              ` : ''}
              ${rechargeToken ? `
              <div class="item">
                <span class="label">Recharge Token</span>
                <span class="value">${rechargeToken}</span>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Receipt generated from BlowMoney App</p>
              <p>Thank you for using BlowMoney!</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  // Function to create and share receipt as PDF
  const createAndSharePDF = async () => {
    try {
      // Generate HTML content
      const htmlContent = generateReceiptHTML();

      // Generate a unique filename
      const timestamp = new Date().getTime();
      const id = userData?.id || userData?.transaction?.id || 'unknown';
      const prefix = Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'BP' : 'BM';
      const fileName = `${prefix}_Receipt_${id.slice(-4)}_${timestamp}`;

      // Create PDF
      const options = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Documents',
        base64: false,
      };

      const file = await RNHTMLtoPDF.convert(options);

      // On Android, save to Downloads folder for better accessibility
      if (Platform.OS === 'android') {
        try {

          const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;

          // Copy from cache to downloads
          await RNFS.copyFile(file.filePath, downloadPath);

          // Update file path to the Downloads path
          file.filePath = downloadPath;

          Toast.show({
            type: 'success',
            text1: 'Receipt Saved',
            text2: `PDF saved to Downloads/${fileName}.pdf`,
          });
        } catch (e) {
          console.log('Error copying file:', e);
        }
      }

      // Share the PDF
      await Share.share({
        title: 'Transaction Receipt',
        message: `${Platform.OS == 'ios' || AppConstant.isAmazonStore ? 'BLowpay' : 'BillsByBlowmoney'} Transaction Receipt`,
        url: Platform.OS === 'ios' ? `file://${file.filePath}` : `file://${file.filePath}`,
      });

      return file.filePath;
    } catch (error) {
      console.error('PDF creation failed', error);
      throw error;
    }
  };

  // Function to create and share receipt as text file
  const createAndShareTextFile = async () => {
    try {
      // Format transaction details for receipt
      const transactionDate = userData?.updatedAt
        ? formatTime(userData?.updatedAt)
        : formatTime(userData?.flutterwaveResponse?.transaction_date);

      const amount = userData?.amount
        ? `₦${parseFloat(userData?.amount / 100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
        : `₦${parseFloat(userData?.flutterwaveResponse?.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      const description = userData?.description || userData?.flutterwaveResponse?.product || 'Transaction';
      const status = userData?.status || userData?.transaction?.status || 'Unknown';
      const id = userData?.id || userData?.transaction?.id || 'Unknown';

      // Create a plain text receipt
      const appName = Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'BlowPay' : 'BillsByBlowMoney';
      const textReceipt = `
${appName} Transaction Receipt
---------------------------
Amount: ${amount}
Description: ${description}
Status: ${status}
Transaction ID: ${id}
Date: ${transactionDate}
${userData?.metadata?.meterno ? `Meter Number: ${userData?.metadata?.meterno}` : ''}
${userData?.metadata?.token ? `Token: ${userData?.metadata?.token || token?.replace("/PIN", '')}` : ''}
${userData?.flutterwaveResponse?.extra ? `Recharge Token: ${userData?.flutterwaveResponse?.extra}` : ''}
---------------------------
Receipt generated from ${appName} App
      `;

      // Generate a unique filename based on transaction ID and date
      const timestamp = new Date().getTime();
      const prefix = Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'BP' : 'BM';
      const fileName = `${prefix}_Receipt_${id.slice(-4)}_${timestamp}.txt`;

      // Save path - in Downloads folder
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      // Write the text file
      await RNFS.writeFile(path, textReceipt, 'utf8');

      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Receipt Saved',
        text2: `Receipt saved to Downloads/${fileName}`,
      });

      // Share the receipt text
      await Share.share({
        title: 'Transaction Receipt',
        message: textReceipt,
      });

      return path;
    } catch (error) {
      console.error('Text file creation failed', error);
      throw error;
    }
  };

  // Main function to handle sharing receipt
  const shareTransaction = async () => {
    if (isSharing) return;

    setIsSharing(true);
    try {
      if (Platform.OS === 'android') {
        // Request storage permission
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Toast.show({
            type: 'error',
            text1: 'Permission Denied',
            text2: 'Storage permission is required to save receipts',
          });
          setIsSharing(false);
          return;
        }
      }

      let filePath;

      // Create and share receipt based on selected format
      if (shareFormat === 'pdf') {
        filePath = await createAndSharePDF();
      } else {
        filePath = await createAndShareTextFile();
      }

      // Option to view the file (particularly useful for PDF)
      if (shareFormat === 'pdf') {
        try {
          await FileViewer.open(filePath, { showOpenWithDialog: true });
        } catch (viewerError) {
          console.log('Error opening file viewer:', viewerError);
          // Continue even if viewer fails
        }
      }

      Toast.show({
        type: 'success',
        text1: 'Receipt Shared',
        text2: 'Transaction receipt has been shared successfully',
      });
    } catch (error) {
      console.log('Error sharing:', error);
      Toast.show({
        type: 'error',
        text1: 'Sharing Failed',
        text2: 'Unable to share the receipt. Please try again.',
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Toggle between PDF and text format
  const toggleShareFormat = () => {
    setShareFormat(shareFormat === 'pdf' ? 'text' : 'pdf');
    Toast.show({
      type: 'info',
      text1: `Format: ${shareFormat === 'pdf' ? 'Text' : 'PDF'}`,
      text2: `Receipt will be shared as ${shareFormat === 'pdf' ? 'text' : 'PDF'}`,
    });
  };

  // Helper functions
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-400';

    const statusLower = status.toLowerCase();
    if (statusLower.includes('success') || statusLower === 'completed') {
      return 'bg-green-500';
    } else if (statusLower.includes('pend') || statusLower === 'processing') {
      return 'bg-yellow-500';
    } else if (statusLower.includes('fail') || statusLower === 'declined' || statusLower === 'cancelled') {
      return 'bg-red-500';
    }
    return 'bg-gray-400';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';

    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return timestamp.toString();
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View
        style={tw` bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10  gap-3 justify-between h-[85%]`}>
          <View style={tw` flex flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`p-1 bg-black items-center justify-center rounded-full w-[30px] h-[30px]`}
              activeOpacity={0.65}
              onPress={closeModal}>
              <Ionicons name="chevron-back" size={13} color={WHITE} />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`p-1 bg-gray-200 items-center justify-center rounded-full px-3 h-[30px] flex-row`}
              activeOpacity={0.65}
              onPress={toggleShareFormat}>
              <Text style={tw`text-[10px] text-black mr-1`}>
                {shareFormat.toUpperCase()}
              </Text>
              <Ionicons name="swap-horizontal" size={13} color={BLACK} />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`p-1 bg-black items-center justify-center rounded-full w-[30px] h-[30px]`}
              activeOpacity={0.65}
              disabled={isSharing}
              onPress={shareTransaction}>
              <Ionicons name={isSharing ? "cloud-download-outline" : "download-outline"} size={13} color={WHITE} />
            </TouchableOpacity>
          </View>

          <View style={tw`mt-4 gap-3`}>
            <View style={tw`flex items-center flex-row justify-center`}>
              <View style={tw`mr-2`}>
                {Platform.OS === 'ios' || AppConstant.isAmazonStore ?
                  <Appicon width={24} height={24} /> :
                  <Appicon2 width={24} height={24} />
                }
              </View>
              <Text style={tw`text-[#101828] font-medium text-[19px]`}>
                Transaction Details
              </Text>
            </View>
          </View>

          <View style={tw`mt-2 gap-2 h-[90%]`}>
            <ScrollView
              ref={receiptRef}
              style={tw`border-[0.5px] border-[#D0D5DD] p-2 rounded-[8px] gap-3 mb-30 bg-white`}>
              {message === 'FAILED' ? (
                <View style={tw`p-4 bg-[#FEF2F2] border-l-4 border-[#EF4444] rounded-[8px]`}>
                  <Text style={tw`text-[#B91C1C] font-medium text-[14px]`}>
                    Oops! Something went wrong. Please try again in a moment.
                    If the issue persists, contact support.
                  </Text>
                </View>
              ) : (
                <View style={tw`border-[0.5px] bg-[#F8F8FA] border-[#D0D5DD] p-3 py-6 rounded-[8px] gap-6`}>
                  {/* Amount Section */}
                  <View style={tw`flex flex-row items-center justify-between`}>
                    <View>
                      <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                        Amount
                      </Text>
                      <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                        ₦{parseFloat(userData?.amount ? userData?.amount / 100 : userData?.flutterwaveResponse?.amount)
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(
                        parseFloat(userData?.amount ? userData?.amount / 100 : userData?.flutterwaveResponse?.amount)
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                      )}>
                      <Image
                        source={require('../../../assets/icons/copy.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Description Section */}
                  <View style={tw`flex flex-row items-center justify-between`}>
                    <View>
                      <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                        Description
                      </Text>
                      <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                        {userData?.description || userData?.flutterwaveResponse?.product || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Status Section */}
                  <View style={tw`flex flex-row items-center justify-between`}>
                    <View>
                      <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                        Status
                      </Text>
                      <View style={tw`flex flex-row items-center`}>
                        <View style={tw`h-2 w-2 rounded-full mr-2 ${getStatusColor(userData?.status || userData?.transaction?.status)}`} />
                        <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                          {userData?.status || userData?.transaction?.status || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Transaction ID Section */}
                  <View style={tw`flex flex-row items-center justify-between`}>
                    <View>
                      <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                        Transaction ID
                      </Text>
                      <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                        {userData?.id || userData?.transaction?.id || 'N/A'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(userData?.id || userData?.transaction?.id)}>
                      <Image
                        source={require('../../../assets/icons/copy.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Time Section */}
                  <View style={tw`flex flex-row items-center justify-between`}>
                    <View>
                      <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                        Time
                      </Text>
                      <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                        {formatTime(userData?.updatedAt || userData?.flutterwaveResponse?.transaction_date)}
                      </Text>
                    </View>
                  </View>

                  {/* Extra Recharge Token if available */}
                  {userData?.flutterwaveResponse?.extra && (
                    <View style={tw`flex flex-row items-center justify-between`}>
                      <View>
                        <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                          Recharge Token
                        </Text>
                        <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                          {userData?.flutterwaveResponse?.extra}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(userData?.flutterwaveResponse?.extra)}>
                        <Image
                          source={require('../../../assets/icons/copy.png')}
                          style={{ width: 20, height: 20 }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Improved Token Section */}
                  {/* {userData?.metadata?.meterno && (
                    <View style={tw`mt-2 border-t border-[#E5E7EB] pt-4`}>
                      <View style={tw`flex flex-row items-center justify-between mb-2`}>
                        <Text style={tw`text-[#4B5563] font-semibold text-[14px]`}>
                          Token Information
                        </Text>
                      </View>

                      <View style={tw`flex flex-row items-center justify-between mb-2`}>
                        <View>
                          <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                            Meter Number
                          </Text>
                          <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                            {userData?.metadata?.meterno}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => copyToClipboard(userData?.metadata?.meterno)}>
                          <Image
                            source={require('../../../assets/icons/copy.png')}
                            style={{ width: 20, height: 20 }}
                          />
                        </TouchableOpacity>
                      </View>

                      {userData?.metadata?.token || token ? (
                        <View style={tw`bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-4 rounded-[8px] mb-2`}>
                          <View style={tw`flex flex-row items-center justify-between`}>
                            <View style={tw`flex-1`}>
                              <Text style={tw`text-[#78350F] font-normal text-[12px] mb-1`}>
                                Generated Token
                              </Text>
                              <Text style={tw`text-[#000000] font-bold text-[13px]`}>
                                {userData?.metadata?.token || token?.replace("/PIN", '')}
                              </Text>
                              {tokenFetchTime && (
                                <Text style={tw`text-[#78350F] font-normal text-[10px] mt-1`}>
                                  Generated at: {tokenFetchTime}
                                </Text>
                              )}
                            </View>
                            <TouchableOpacity
                              style={tw`ml-2`}
                              onPress={() => copyToClipboard(userData?.metadata?.token || token?.replace("/PIN", ''))}>
                              <Image
                                source={require('../../../assets/icons/copy.png')}
                                style={{ width: 24, height: 24 }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View style={tw`border border-[#D1D5DB] rounded-[8px] p-4 mb-2`}>
                          <View style={tw`flex flex-row items-center justify-between`}>
                            <View style={tw`flex-1`}>
                              <Text style={tw`text-[#4B5563] font-medium text-[14px]`}>
                                No token available
                              </Text>
                              <Text style={tw`text-[#6B7280] text-[12px] mt-1`}>
                                Click the button to fetch your token
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={tw`ml-2 bg-[#10B981] px-3 py-2 rounded-[6px] ${gettingToken === 'pending' ? 'opacity-70' : ''}`}
                              disabled={gettingToken === 'pending'}
                              onPress={() => requestNewToken()}>
                              {gettingToken === 'pending' ? (
                                <View style={tw`flex flex-row items-center`}>
                                  <ActivityIndicator size="small" color="#ffffff" style={tw`mr-1`} />
                                  <Text style={tw`text-white font-medium text-[12px]`}>Fetching...</Text>
                                </View>
                              ) : (
                                <Text style={tw`text-white font-medium text-[12px]`}>Fetch Token</Text>
                              )}
                            </TouchableOpacity>
                          </View>
                          {gettingToken === 'failed' && (
                            <Text style={tw`text-[#EF4444] text-[12px] mt-2`}>
                              Failed to fetch token. Please try again.
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  )} */}
                  {userData?.description == "Electricity" && (
                    <View style={tw`mt-2 border-t border-[#E5E7EB] pt-4`}>
                      <View style={tw`flex flex-row items-center justify-between mb-2`}>
                        <Text style={tw`text-[#4B5563] font-semibold text-[14px]`}>
                          Token Information
                        </Text>
                      </View>

                      <View style={tw`flex flex-row items-center justify-between mb-2`}>
                        <View>
                          <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                            Meter Number
                          </Text>
                          <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                            {userData?.metadata?.meterno}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => copyToClipboard(userData?.metadata?.meterno)}>
                          <Image
                            source={require('../../../assets/icons/copy.png')}
                            style={{ width: 20, height: 20 }}
                          />
                        </TouchableOpacity>
                      </View>

                      {userData?.metadata?.token || token ? (
                        <View style={tw`bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-4 rounded-[8px] mb-2`}>
                          <View style={tw`flex flex-row items-center justify-between`}>
                            <View style={tw`flex-1`}>
                              <Text style={tw`text-[#78350F] font-normal text-[12px] mb-1`}>
                                Generated Token
                              </Text>
                              <Text style={tw`text-[#000000] font-bold text-[13px]`}>
                                {userData?.metadata?.token || token?.replace("/PIN", '')}
                              </Text>
                              {tokenFetchTime && (
                                <Text style={tw`text-[#78350F] font-normal text-[10px] mt-1`}>
                                  Generated at: {tokenFetchTime}
                                </Text>
                              )}
                            </View>
                            <TouchableOpacity
                              style={tw`ml-2`}
                              onPress={() => copyToClipboard(userData?.metadata?.token || token?.replace("/PIN", ''))}>
                              <Image
                                source={require('../../../assets/icons/copy.png')}
                                style={{ width: 24, height: 24 }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View style={tw`border border-[#D1D5DB] rounded-[8px] p-4 mb-2`}>
                          <View style={tw`flex flex-row items-center justify-between`}>
                            <View style={tw`flex-1`}>
                              <Text style={tw`text-[#4B5563] font-medium text-[14px]`}>
                                No token available
                              </Text>
                              <Text style={tw`text-[#6B7280] text-[12px] mt-1`}>
                                Click the button to fetch your token
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={tw`ml-2 bg-[#10B981] px-3 py-2 rounded-[6px] ${gettingToken === 'pending' ? 'opacity-70' : ''}`}
                              disabled={gettingToken === 'pending'}
                              onPress={() => requestNewToken()}>
                              {gettingToken === 'pending' ? (
                                <View style={tw`flex flex-row items-center`}>
                                  <ActivityIndicator size="small" color="#ffffff" style={tw`mr-1`} />
                                  <Text style={tw`text-white font-medium text-[12px]`}>Fetching...</Text>
                                </View>
                              ) : (
                                <Text style={tw`text-white font-medium text-[12px]`}>Fetch Token</Text>
                              )}
                            </TouchableOpacity>
                          </View>
                          {gettingToken === 'failed' && (
                            <Text style={tw`text-[#EF4444] text-[12px] mt-2`}>
                              Failed to fetch token. Please try again.
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  )}

                  {/* Dynamic Metadata Section */}
                  {userData?.metadata && Object.keys(userData.metadata).length > 0 && (
                    <View style={tw`mt-2 border-t border-[#E5E7EB] pt-4`}>
                      <Text style={tw`text-[#4B5563] font-semibold text-[14px] mb-3`}>
                        Additional Information
                      </Text>

                      {Object.entries(userData.metadata).map(([key, value]) => {
                        // Skip wallet balance or empty values or already displayed meterno
                        if (key === 'walletbalance' || !value || key === 'meterno' || key === 'token') {
                          return null;
                        }

                        // Format the key for display
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                          .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                          .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
                          .replace(/[-_]/g, ' '); // Replace dashes and underscores with spaces

                        // Format value based on type
                        let displayValue = value;
                        let canCopy = true;

                        if (typeof value === 'object' && value !== null) {
                          displayValue = JSON.stringify(value);
                        } else if (typeof value === 'boolean') {
                          displayValue = value ? 'Yes' : 'No';
                        }

                        return (
                          <View key={key} style={tw`flex flex-row items-center justify-between mb-3`}>
                            <View style={tw`flex-1`}>
                              <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                                {formattedKey}
                              </Text>
                              <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                                {displayValue.toString()}
                              </Text>
                            </View>
                            {canCopy && (
                              <TouchableOpacity onPress={() => copyToClipboard(displayValue.toString())}>
                                <Image
                                  source={require('../../../assets/icons/copy.png')}
                                  style={{ width: 20, height: 20 }}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        

        <View style={tw`pb-5`}>
          <CustomButton onPress={done} text={'Done'} style={tw`bg-[#FF114A]`} />
          {isSharing && <Text style={tw`text-center text-xs text-gray-500 mt-2`}>
            {shareFormat === 'pdf' ? 'Creating PDF receipt...' : 'Preparing text receipt...'}
          </Text>}
        </View>
        {status === 'pending' && <Loader />}
      </View>
    </PanGestureHandler>
  );
};

export default TransactionDetails;