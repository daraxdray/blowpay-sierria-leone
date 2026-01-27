import React from "react";
import {SafeAreaView, Platform, StyleSheet, Image, StatusBar} from "react-native";
import { WIDTH } from "../styles";
import Tsvg from "../../../assets/svg/icons/transportation.svg";
import Rsvg from "../../../assets/svg/icons/rent.svg";
import Fsvg from "../../../assets/svg/icons/food.svg";
import Msvg from "../../../assets/svg/icons/medicals.svg";
import Bsvg from "../../../assets/svg/icons/bills.svg";

export const ScreenView = ({style, children, dark, light, color}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {(dark || light) &&
        <StatusBar barStyle={dark ? "dark-content" : "light-content"} backgroundColor={color ? color : dark ? "#fff": "#aaa"}/>}
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: WIDTH,
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
});

export const ExpenseImage = (item) => {
  return item === "Transportation" ? (
    <Rsvg width={25} height={25} />
  ) : item === "Sales Expense" ? (
    <Image
      source={require("../../../assets/images/expense.png")}
      style={{ height: 25, width: 25 }}
    />
  ) : item === "Rent" ? (
    <Tsvg width={25} height={25} />
  ) : item === "Food" ? (
    <Fsvg width={25} height={25} />
  ) : item === "Medical" ? (
    <Msvg width={25} height={25} />
  ) : item === "Bill" ? (
    <Bsvg width={25} height={25} />
  ) : item === "Clothing" ? (
    <Image
      source={require("../../../assets/images/laundry.png")}
      style={{ height: 25, width: 25 }}
    />
  ) : item === "Sports" ? (
    <Image
      source={require("../../../assets/images/sports.png")}
      style={{ height: 25, width: 25 }}
    />
  ) : item === "Education" ? (
    <Image
      source={require("../../../assets/images/education.png")}
      style={{ height: 25, width: 25 }}
    />
  ) : item === "Housing" ? (
    <Tsvg width={25} height={25} />
  ) : item === "Debt Payment" ? (
    <Image
      source={require("../../../assets/images/acquisition.png")}
      style={{ height: 25, width: 25 }}
    />
  ) : item === "Personal & Discretionary" ? (
    <Image
      source={require("../../../assets/images/user.png")}
      style={{ height: 28, width: 28 }}
    />
  ) : item === "Miscellaneous" ? (
    <Image
      source={require("../../../assets/images/candy.png")}
      style={{ height: 25, width: 25 }}
    />
  ) : null;
};

export const IncomeImage = (item) => {
  return item === "Salary" ? (
    <Image
      source={require("../../../assets/images/salary.png")}
      style={{ height: 25, width: 25 }}
    />
  ) : item === "Sales" ? (
    <Image
      source={require("../../../assets/images/expense.png")}
      style={{ height: 25, width: 25 }}
    />
  ) : item === "Dividend" ? (
    <Tsvg width={25} height={25} />
  ) : item === "Rental/Income" ? (
    <Rsvg width={25} height={25} />
  ) : item === "Gift/Donation" ? (
    <Msvg width={25} height={25} />
  ) : item === "Interest Income" ? (
    <Bsvg width={25} height={25} />
  ) :
  item === "Other Incomes" ? (
    <Image
      source={require("../../../assets/images/more.png")}
      style={{ height: 25, width: 25 }}
    />
  ) 
  :
  item == "Business Income 1" ? (
    <Bsvg width={25} height={25} />
  ) :
  item === "Business Income 2" ? (
    <Bsvg width={25} height={25} />
  ) :
  item === "Business Income 3" ? (
    <Bsvg width={25} height={25} />
  ) :
  item === "Business Income 4" ? (
    <Bsvg width={25} height={25} />
  ) :
  item === "Bank Balance" ? (
    <Bsvg width={25} height={25} />
  ) :
  item === "Cash Balance" ? (
    <Bsvg width={25} height={25} />
  ) :  null;
};
