import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Themes, Images } from "../../assets/themes";

const JoinVehicleButton = ({ title }) => (
  <TouchableOpacity onPress={() => {}} style={styles.buttonContainer}>
    <Text style={styles.blackSubtext}>{title}</Text>
  </TouchableOpacity>
);

const TripVehicle = ({ vehicle }) => (
  <View style={styles.container}>
    <View style={styles.vehicleIconContainer}>
      <View style={styles.circle}>
        <Image source={ Images.car } style={styles.image} />
      </View>
      <Text style={styles.graySubtext}>{vehicle.departure_time}</Text>
    </View>

    <View style={styles.vehicleDescriptionContainer}>
      <Text style={styles.blackText}>
        {vehicle.username}'s {vehicle.vehicle_model.includes("Uber") ? vehicle.vehicle_model : "Car"}
      </Text>
      <Text style={styles.graySubtext}>{vehicle.vehicle_model}</Text>
      <Text style={styles.graySubtext}>
        {"Pickup at " + vehicle.meeting_spot}
      </Text>
      <View style={styles.vehiclePassengersContainer}>
        {vehicle.passengers.map((passenger, index) => (
          <Image
            key={index}
            source={{ uri: passenger.imageURL }}
            style={styles.passengerImage}
          />
        ))}
      </View>
    </View>
    <View style={styles.joinVehicleContainer}>
      {vehicle.passengers.length >= vehicle.capacity - 1 ? (
        <JoinVehicleButton title="Full" onPress={() => {}} />
      ) : (
        <JoinVehicleButton title="+ Join Car" onPress={() => {}} />
      )}
      <Text style={styles.graySubtext}>
        {vehicle.passengers.length + 1}/{vehicle.total_num_seats} Full
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Themes.colors.lightGray,
  },
  vehicleIconContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 20,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: Themes.colors.orange,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  vehicleDescriptionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "left",
  },
  buttonContainer: {
    justifyContent: "center",
    overflow: "hidden",
    borderColor: Themes.colors.orange,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 1,
    marginVertical: 2,
  },
  graySubtext: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: Themes.colors.darkGray,
  },
  blackSubtext: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  blackText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: Themes.colors.black,
  },
  joinVehicleContainer: {
    alignItems: "flex-end",
  },
  vehicleIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  vehiclePassengersContainer: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "left",
  },
  passengerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 1,
  },
});

export default TripVehicle;
