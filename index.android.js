/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
    Image
} from 'react-native';

export default class DummyApplication extends Component {


  render() {
    let picture_URL = {
      uri: 'https://ih1.redbubble.net/image.24694638.0052/flat,800x800,070,f.u1.jpg'
    };

    return (
      <View style={{flex: 1}}>
        <TestText name="World!"/>
        <TestText name="Earth!"/>
        <TestText name="Universe!"/>
        <BlinkingText text="Hello Everyone!"/>
        <Image source={picture_URL} style={{width: 100, height:100}}/>
        <Text style={styles.gianttext}>GIANT TEXT</Text>
        <Text style={styles.smalltext}>small text</Text>
        <Text style={styles.greentext}>green text</Text>
        <ColorSquare/>
      </View>


    );
  }
}

class TestText extends Component{ // dit is de custom prop TestText, die alleen een text rendert met het attribuut wat door de DummyApplication wordt meegegeven
  render(){
    return(
        <Text>Hello {this.props.name}</Text>
    );
  }
}

class ColorSquare extends Component{
    render(){
        return(
            <View style={{flex: 2}}>
                <View style={{flex: 3, backgroundColor: 'green'}}/>
                <View style={{flex: 4, backgroundColor: 'blue'}}/>
            </View>
        )
    }

}

class BlinkingText extends Component{
    constructor(props){
        super(props);
        this.state = {showBlinkingText: true}; // initialiseer 'state' die gebruikt wordt om de dickbutt wel of niet te laten zien

        setInterval(() =>{
            this.setState({showBlinkingText: !this.state.showBlinkingText}); // deze regel vraagt de showBlinkingText state op en veranderd deze naar de inverse
        }, 2000); // 2000 is de tijd wanneer de regel hieboven wordt uitgevoerd. 2000 = 2000 milliseconden = 2 seconden
    }

  render(){
    let displayImage = this.state.showBlinkingText ? this.props.text: ' ';
    return(
      <Text>{displayImage}</Text>
    );
  }
}

const styles = StyleSheet.create({
  gianttext: {
    fontSize: 50,
  },

  smalltext: {
    fontSize: 5,
  },

  greentext:{
    color: 'green',
  },
});

AppRegistry.registerComponent('DummyApplication', () => DummyApplication);
