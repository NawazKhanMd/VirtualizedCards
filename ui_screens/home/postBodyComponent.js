import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, StatusBar, Animated, TouchableOpacity, Share } from 'react-native';
import moment from 'moment';
import { Icon, Tooltip } from '@ui-kitten/components';
const colors = ['#D47FA6', '#8A56AC', '#241332', '#4EBDEF', '#4666E5', '#132641', '#52912E', '#417623', '#253E12']
const minH = (Dimensions.get('screen').height - StatusBar.currentHeight) / 3 //250   // Min Height of a card once we hide content 
const spinValue = new Animated.Value(0)

let prevSelected = -1

export const Post = ({ data, index, selectedCardIndex, selectedView }) => {
    const ExtendBottom = new Animated.Value(-minH / 1.5)  // 
    const skrinkBottom = new Animated.Value(-15)  // 
    const rotateCard = new Animated.Value(1);
    const rotateBack = new Animated.Value(1);
    const animatedValue = new Animated.Value(0);

    const [likes, updateLikes] = useState(0)
    const [tootlTipVisible, settootlTipVisible] = React.useState(false);

    const handleShare = (dataObj) => {
        settootlTipVisible(true)
        setTimeout(() => {
            settootlTipVisible(false)
            try {
                Share.share({
                    message:
                        dataObj.title,
                });
            } catch (error) {
                alert(error.message);
            }
        }, 800)
    }

    useEffect(() => {
        prevSelected = selectedCardIndex;
        Animated.timing(animatedValue,
            {
                toValue: selectedCardIndex == index ? 1 : 0,
                duration: 500,
                useNativeDriver: true
            }).start();
        Animated.timing(
            rotateCard,
            {
                useNativeDriver: false,
                toValue: selectedCardIndex == index ? 0 : 1,
                duration: 300,
            }
        ).start();
        Animated.timing(
            rotateBack,
            {
                useNativeDriver: false,
                toValue: selectedCardIndex == prevSelected ? 0 : 1,
                duration: 500,
            }
        ).start();
        Animated.timing(
            skrinkBottom,
            {
                useNativeDriver: false,
                toValue: selectedCardIndex == prevSelected ? -minH / 1.5 : -15,// selectedCardIndex == index ? -minH / 1.5:-15,
                duration: 500,
            }
        ).start();
        Animated.timing(
            ExtendBottom,
            {
                useNativeDriver: false,
                toValue: selectedCardIndex == index ? -15 : -minH / 1.5,
                duration: 150,
            }
        ).start();
    }, [selectedCardIndex, selectedView])

    let heightOfTheCard = 0
    let cardRotation = null
    let marginBottomOftheCard = 0
    if (selectedCardIndex == index && selectedView == 0) {
        heightOfTheCard = 'auto'
        cardRotation = rotateCard.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-35deg']
        });
        marginBottomOftheCard = ExtendBottom
    } else if (index == prevSelected && selectedView == 0) {
        heightOfTheCard = minH
        cardRotation = rotateBack.interpolate({
            inputRange: [0, 1],
            outputRange: ['-35deg', '0deg']
        });
        marginBottomOftheCard = skrinkBottom;
    } else if (selectedView == 0) {
        heightOfTheCard = minH
        cardRotation = '-35deg';
        marginBottomOftheCard = -minH / 1.5
    } else {
        heightOfTheCard = 'auto'
        cardRotation = '0deg';
        marginBottomOftheCard = 0
    }

    return (

        <Animated.View style={{
            ...styles.container, backgroundColor: colors[index % 9],
            height: heightOfTheCard,
            transform: [{
                rotateX: cardRotation
            }],
            marginBottom: marginBottomOftheCard,
        }}>
            {/* <Animated.View style={[{width:100,height:100,backgroundColor:'grey', opacity: animatedValue}]}/> */}
            <Text numberOfLines={2} style={styles.title}>{data.title}</Text>
            <Text style={styles.subTitle}>{moment(data.created_at).format('D MMM')}</Text>
            {(selectedCardIndex == index) &&                                                              // having this condition will improve performance
                <Animated.View style={{ opacity: animatedValue }}>
                    <View style={styles.content}>
                        <Text style={styles.contentText}>{data.body}</Text>
                    </View>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={() => handleShare(data)} >
                            <Tooltip
                                anchor={() => (<Icon fill={'white'} style={styles.actionIcons} name='share' />)}
                                visible={tootlTipVisible}
                                backdropStyle={styles.backdrop}
                                onBackdropPress={() => settootlTipVisible(false)}>
                                <Text style={{ ...styles.subTitle, ...styles.margH5 }}>Thank you for the support!</Text>
                                <Text style={styles.title}>😻</Text>
                            </Tooltip>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateLikes(likes + 1)} >
                            <View style={styles.likesContainer}>
                                <Text style={{ ...styles.title, ...styles.margH5 }}>{likes}</Text>
                                <Icon fill={'white'} style={styles.actionIcons} name='heart-outline' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        marginTop: 15,
        justifyContent: 'flex-start',
        padding: 15,
        elevation: 10,
        width: Dimensions.get('screen').width - 60,
        marginHorizontal: 30,
        borderRadius: 15
    },
    title: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1.2,
    }, subTitle: {
        color: 'white',
        fontSize: 13,
        letterSpacing: 1.2,
    }, content: {
        paddingVertical: 15,
    }, contentText: {
        color: 'white',
        fontSize: 15,
        letterSpacing: 1.2,
    }, actionsContainer: {
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }, actionIcons: {
        width: 20, height: 20
    }, likesContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }, margH5: {
        marginHorizontal: 5
    }, backdrop: {
        backgroundColor: 'transparent',
    },
});