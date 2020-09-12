import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, StatusBar, Animated, TouchableOpacity, Share, Image } from 'react-native';

export const Error = ({state}) => {
    const image = state == 0 ? require('../../images/no_internet.gif') : require('../../images/network_error.gif');
    const text = state == 0 ? 'We are trying to Re-Connect...' : 'There was a technical issue, We are trying again...';
    return (
        <View style={styles.container}>
            <Image style={styles.gif_image} source={image}></Image>
            <Text style={styles.infoText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
       position:'absolute',
       top:0,
       bottom:0,
       left:0,
       right:0,
       backgroundColor:'white',
       display:'flex',
       justifyContent:'center',
       alignItems:'center'
    },gif_image:{
        width:Dimensions.get('screen').width,
        height:Dimensions.get('screen').width
    },infoText:{
        color:'lightblue'
    }
});