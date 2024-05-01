import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Themes } from "../../assets/themes";

const AddVehicleButton = ({ navigation, title, trip }) => (
  <TouchableOpacity
    style={styles.addVehicleButton}
    onPress={() => navigation.navigate("YourVehicles", {trip: trip})}
  >
    <Text style={styles.blackSubtext}>{title}</Text>
  </TouchableOpacity>
);

const formatDate = (rawDate) => {
  const date = rawDate.toDate()
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  const nthNumber = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${month} ${day}${nthNumber(day)}, ${year}`;
};

const TripDetails = ({ navigation, trip }) => (
  <View style={styles.tripDetailsContainer}>
    <View style={styles.tripDetails}>
      <View style={styles.tripIconContainer}>
        <Image source={{ uri: trip["community_picture"] }} style={styles.tripIcon} />
        <Text style={styles.blackSubtext}>{trip["community_name"]}</Text>
      </View>
      <View>
        <Text style={styles.blackTextBold}>
          {trip["source"] + " to " + trip["destination"]}
        </Text>
        <Text style={styles.blackSubtext}>{formatDate(trip["date"])}</Text>
      </View>
    </View>
    <View style={styles.tripDetailsButtonContainer}>
      <AddVehicleButton navigation={navigation} title="+ Add a Vehicle" trip={trip}/>
    </View>
    <View style={styles.borderView} />
  </View>
);

const styles = StyleSheet.create({
  tripDetailsContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 0,
  },
  tripIconContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 20,
  },
  tripDetails: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: Dimensions.get("window").width - 50,
  },
  tripDetailsButtonContainer: {
    alignItems: "center",
    paddingTop: 15,
    width: Dimensions.get("window").width - 35,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Themes.colors.lightGray,
  },
  tripIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginVertical: 5,
  },
  blackTextBold: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: Themes.colors.black,
  },
  blackSubtext: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  tripDeparture: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: Themes.colors.lightGray,
  },
  borderView: {
    paddingTop: 10,
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    alignSelf: "center",
  },
  addVehicleButton: {
    backgroundColor: Themes.colors.white,
    width: 200,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderColor: Themes.colors.orange,
    borderWidth: 1,
  },
});

export default TripDetails;
