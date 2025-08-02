import OnlineSVG from '../../../assets/svgs/Online.svg';
import AddfundSVG from '../../../assets/svgs/Addfund.svg';
import AdsSVG from '../../../assets/svgs/Ads.svg';
import {format} from 'date-fns'; // Ensure you have date-fns installed for formatting

export const formatTime = date => {
  if (!date) {
    return 'Invalid Date';
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return 'Invalid Date';
  }

  // Use the updated functions
  if (isToday(parsedDate)) {
    return 'Today';
  } else if (isYesterday(parsedDate)) {
    return 'Yesterday';
  } else {
    return format(parsedDate, 'dd MMM yyyy');
  }
};

const isToday = date => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isYesterday = date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};
export const transactions = [
  // {
  //   id: '1',
  //   Icon: OnlineSVG,
  //   time: '2 mins ago',
  //   description: 'Transaction',
  //   amount: 'NGN7,200',
  //   amountColor: '#F04343',
  // },
  // {
  //   id: '2',
  //   Icon: AddfundSVG,
  //   time: '5 mins ago',
  //   description: 'Add Funds',
  //   amount: 'NGN10,000',
  //   amountColor: '#10B981',
  // },
  // {
  //   id: '3',
  //   Icon: AdsSVG,
  //   time: '10 mins ago',
  //   description: 'Ads Payment',
  //   amount: 'NGN3,500',
  //   amountColor: '#F04343',
  // },
  // {
  //   id: '4',
  //   Icon: OnlineSVG,
  //   time: '15 mins ago',
  //   description: 'Transaction',
  //   amount: 'NGN2,300',
  //   amountColor: '#F04343',
  // },
  // {
  //   id: '5',
  //   Icon: AddfundSVG,
  //   time: '20 mins ago',
  //   description: 'Add Funds',
  //   amount: 'NGN5,000',
  //   amountColor: '#10B981',
  // },
  // {
  //   id: '6',
  //   Icon: AdsSVG,
  //   time: '30 mins ago',
  //   description: 'Ads Payment',
  //   amount: 'NGN6,800',
  //   amountColor: '#F04343',
  // },
  // {
  //   id: '7',
  //   Icon: OnlineSVG,
  //   time: '45 mins ago',
  //   description: 'Transaction',
  //   amount: 'NGN4,000',
  //   amountColor: '#F04343',
  // },
  // {
  //   id: '8',
  //   Icon: AddfundSVG,
  //   time: '1 hour ago',
  //   description: 'Add Funds',
  //   amount: 'NGN8,500',
  //   amountColor: '#10B981',
  // },
  // {
  //   id: '9',
  //   Icon: AdsSVG,
  //   time: '2 hours ago',
  //   description: 'Ads Payment',
  //   amount: 'NGN2,700',
  //   amountColor: '#F04343',
  // },
  // {
  //   id: '10',
  //   Icon: OnlineSVG,
  //   time: '3 hours ago',
  //   description: 'Transaction',
  //   amount: 'NGN12,500',
  //   amountColor: '#F04343',
  // },
];
