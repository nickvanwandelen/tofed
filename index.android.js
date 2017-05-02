import React, {
  Component
}                     from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  View,
  ScrollView,
  ToastAndroid,
  DeviceEventEmitter
}                     from 'react-native';
import Beacons        from 'react-native-beacons-manager';
import moment         from 'moment';
import BluetoothState from 'react-native-bluetooth-state';

const TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';
const IDENTIFIER = 'target2';
const UUID = 'abcdef11223344556677889900fedcba';

class reactNativeBeaconExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // region information
      identifierRef: IDENTIFIER,
      uuidRef: UUID,

      // React Native ListViews datasources initialization
      rangingDataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }).cloneWithRows([]),

      regionEnterDatasource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }).cloneWithRows([]),

      regionExitDatasource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }).cloneWithRows([]),

      // check bluetooth state:
      bluetoothState: '',
    }
  };

  componentWillMount() {
    const { identifierRef, uuidRef } = this.state;
    const region = { identifierRef, uuidRef };

    Beacons.detectIBeacons();

    // start monitoring beacons
    Beacons.startMonitoringForRegion(region)
      .then(() => ToastAndroid.show('Monitoring region', ToastAndroid.SHORT))
      .catch(error => console.log(`Beacons monitoring not started, error: ${error}`));

    // start ranging beacons
    Beacons.startRangingBeaconsInRegion(identifierRef, uuidRef)
      .then(() => ToastAndroid.show('Ranging beacon', ToastAndroid.SHORT))
      .catch(error => console.log(`Beacons ranging not started, error: ${error}`));
  }

  componentDidMount() {
    //
    // component state aware here - attach events
    //
    // monitoring:
    DeviceEventEmitter.addListener(
      'regionDidEnter',
      ({ identifier, uuid, minor, major }) => {
        console.log('monitoring - regionDidEnter data: ', { identifier, uuid, minor, major });
        const time = moment().format(TIME_FORMAT);
        this.setState({ regionEnterDatasource: this.state.regionEnterDatasource.cloneWithRows([{ identifier, uuid, minor, major, time }]) });
      }
    );

    DeviceEventEmitter.addListener(
      'regionDidExit',
      ({ identifier, uuid, minor, major }) => {
        console.log('monitoring - regionDidExit data: ', { identifier, uuid, minor, major });
        const time = moment().format(TIME_FORMAT);
        this.setState({ regionExitDatasource: this.state.regionExitDatasource.cloneWithRows([{ identifier, uuid, minor, major, time }]) });
      }
    );

    // Ranging: Listen for beacon changes
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        const { beacons } = data;
        const { rangingDataSource } = this.state;
        this.setState({ rangingDataSource: rangingDataSource.cloneWithRows(beacons)});
      }
    );
  }

  componentWillUnMount() {
    const { identifierRef, uuidRef } = this.state;

    const region = { identifierRef, uuidRef };

    Beacons.stopMonitoringForRegion(region)
      .then(() => console.log('Beacons monitoring stopped succesfully'))
      .catch(error => console.log(`Beacons monitoring not stopped, error: ${error}`));

    Beacons.stopRangingBeaconsInRegion(identifierRef, uuidRef)
      .then(() => console.log('Beacons ranging stopped succesfully'))
      .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));

    // remove ranging event we registered at componentDidMount
    DeviceEventEmitter.removeListener('beaconsDidRange');
    DeviceEventEmitter.removeListener('regionDidEnter');
    DeviceEventEmitter.removeListener('regionDidExit');
  }

  render() {
    const { bluetoothState, rangingDataSource, regionEnterDatasource, regionExitDatasource } =  this.state;
    return (
      <View style={styles.container}>
      <ScrollView>
      <Text style={styles.headline}>
      ranging beacons in the area:
      </Text>
      <ListView
      dataSource={ rangingDataSource }
      enableEmptySections={ true }
      renderRow={this.renderRangingRow}
      renderSectionHeader={this.renderBeaconSectionHeader}
      />

      <Text style={styles.headline}>
      monitoring enter information:
      </Text>
      <ListView
      dataSource={ regionEnterDatasource }
      enableEmptySections={ true }
      renderRow={this.renderMonitoringEnterRow}
      renderSectionHeader={this.renderBeaconSectionHeader}
      />

      <Text style={styles.headline}>
      monitoring exit information:
      </Text>
      <ListView
      dataSource={ regionExitDatasource }
      enableEmptySections={ true }
      renderRow={this.renderMonitoringLeaveRow}
      renderSectionHeader={this.renderBeaconSectionHeader}
      />
      </ScrollView>
      </View>
    );
  }

  renderBeaconSectionHeader = (sectionData, uuid) => (
    <Text style={styles.rowSection}>
      {uuid}
    </Text>
  );

  renderRangingRow = (rowData) => {
    return (
      <View style={styles.row}>
      <Text style={styles.smallText}>
      UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
      </Text>
      <Text style={styles.smallText}>
      Major: {rowData.major ? rowData.major : 'NA'}
      </Text>
      <Text style={styles.smallText}>
      Minor: {rowData.minor ? rowData.minor : 'NA'}
      </Text>
      <Text>
      RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
      </Text>
      <Text>
      Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
      </Text>
      <Text>
      Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
      </Text>
      </View>
    );
  }

  renderMonitoringEnterRow = ({ identifier, uuid, minor, major, time }) => {
    return (
      <View style={styles.row}>
      <Text style={styles.smallText}>
      Identifier: {identifier ? identifier : 'NA'}
      </Text>
      <Text style={styles.smallText}>
      UUID: {uuid ? uuid  : 'NA'}
      </Text>
      <Text style={styles.smallText}>
      Major: {major ? major : ''}
      </Text>
      <Text style={styles.smallText}>
      Minor: { minor ? minor : ''}
      </Text>
      <Text style={styles.smallText}>
      time: { time ? time : 'NA'}
      </Text>
      </View>
    );
  }

  renderMonitoringLeaveRow = ({ identifier, uuid, minor, major, time }) => {
    return (
      <View style={styles.row}>
      <Text style={styles.smallText}>
      Identifier: {identifier ? identifier : 'NA'}
      </Text>
      <Text style={styles.smallText}>
      UUID: {uuid ? uuid  : 'NA'}
      </Text>
      <Text style={styles.smallText}>
      Major: {major ? major : ''}
      </Text>
      <Text style={styles.smallText}>
      Minor: { minor ? minor : ''}
      </Text>
      <Text style={styles.smallText}>
      time: { time ? time : 'NA'}
      </Text>
      </View>
    );
  }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
      margin: 5,
      backgroundColor: '#F5FCFF',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btleConnectionStatus: {
      fontSize: 20,
      paddingTop: 20
    },
    headline: {
      fontSize: 20,
      paddingTop: 20,
      marginBottom: 20
    },
    row: {
      padding: 8,
      paddingBottom: 16
    },
    smallText: {
      fontSize: 11
    },
    rowSection: {
      fontWeight: '700'
    }
  });

  AppRegistry.registerComponent(
    'reactNativeBeaconExample',
    () => reactNativeBeaconExample
  );
