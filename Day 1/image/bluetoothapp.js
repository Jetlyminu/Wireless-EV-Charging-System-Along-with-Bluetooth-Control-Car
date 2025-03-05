import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { BleManager } from "react-native-ble-plx";

const manager = new BleManager();

const BluetoothCarControl = () => {
  const [device, setDevice] = useState(null);

  const connectBluetooth = async () => {
    manager.startDeviceScan(null, null, (error, foundDevice) => {
      if (error) return console.log(error);

      if (foundDevice.name) {
        manager.stopDeviceScan();
        foundDevice.connect()
          .then((d) => {
            setDevice(d);
            alert("✅ Connected to Bluetooth Car!");
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const sendCommand = async (command) => {
    if (!device) return alert("⚠️ Bluetooth not connected!");
    
    const serviceUUID = "00001101-0000-1000-8000-00805F9B34FB";
    const characteristicUUID = "00001101-0000-1000-8000-00805F9B34FB";
    
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(command);

    await device.writeCharacteristicWithResponseForService(
      serviceUUID,
      characteristicUUID,
      data
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Car Controller</Text>
      <Button title="Connect Bluetooth" onPress={connectBluetooth} />
      <Button title="Forward" onPress={() => sendCommand("F")} />
      <Button title="Left" onPress={() => sendCommand("L")} />
      <Button title="Stop" onPress={() => sendCommand("S")} />
      <Button title="Right" onPress={() => sendCommand("R")} />
      <Button title="Backward" onPress={() => sendCommand("B")} />
      <Button title="Horn" onPress={() => sendCommand("H")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default BluetoothCarControl;
