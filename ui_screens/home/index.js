import React, { useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Dimensions, VirtualizedList, View, Text, InteractionManager } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { get } from './utils/fetch';
import { Post } from './postBodyComponent';
import { Icon } from '@ui-kitten/components';
import { Error } from './error';
const api = 'https://gorest.co.in/public-api/posts?page='

export default function Home({ }) {

  const [arrayOfPosts, setPostsData] = React.useState([]);              // Array of posts
  const [totalPages, setTotalPages] = React.useState(0);                 // Total number of pages in the api
  const [currentPage, setCurrentPage] = React.useState(0);               // Current pagianted page for api calling
  const [selectedCard, setSelectedIndex] = React.useState(-1);           // Keeping the index of selected card to expand or do the animations
  const [selectedView, setSelectedView] = React.useState(0);             // Toggle between Tab View and List View
  const [isOffline, setOfflineFlag] = React.useState(false);             // If Offline this will be true 
  const [isLoading, setLoadingFlag] = React.useState(0);                 //This hase 3 states 0 = LoadingHasFinised , 1 = is Loading, 2 = Network error


  useEffect(() => {
    NetInfo.addEventListener(state => {
      checkInternetAndCall(state.isInternetReachable)
    });
  }, []);


  const checkInternetAndCall = (flag) => {
    if (flag) {
      setOfflineFlag(false)
      getPosts(currentPage + 1);
    } else {
      if (isOffline == false) {
        setLoadingFlag(0);
        setOfflineFlag(true)
      }
    }
  }
  const getPosts = (id = 1) => {
    setLoadingFlag(0);
    get({
      url: api + id,
    })()
      .then(response => {
        if (response != undefined) {
          setLoadingFlag(1);
          InteractionManager.runAfterInteractions(() => {
            setPostsData(arrayOfPosts.concat(response.data.data))
            if (totalPages == 0) {
              setTotalPages(response.data.pages);
            }
            setCurrentPage(id);
          })
        } else {
          setLoadingFlag(2)
        }
      })
      .catch(error => {
        setLoadingFlag(2);
        console.log(error)
      });
  }
  const getItem = (data, index) => {
    return {
      id: Math.random().toString(12).substring(0),                //Generating Unique ID's
      data: data[index],
      index: index,
      total: data.length                                          //data Object 
    }
  }
  const handleSelected = (index) => {
    setSelectedIndex(selectedCard == index ? -1 : index)
  }
  const handleTabClick = (viewIndex) => {
    setSelectedView(viewIndex)
  }
  const Tab = ({ id, name, iconName, selected }) => {
    return (
      <TouchableWithoutFeedback onPress={() => handleTabClick(id)}>
        <View style={selected == id ? styles.selectedTab : styles.tab}>
          <Icon fill={selected == id ? '#fff' : '#8A56AC'} style={styles.tabIcon} name={iconName} />
          <Text style={selected == id ? styles.selectedTabText : styles.tabText}>{name}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }


  if (isLoading != 2 && !isOffline) {
    return (
      <View>
        <View style={styles.tabsView}>
          <Tab id={0} name={'Stacked view'} iconName={'layers'} selected={selectedView} />
          <Tab id={1} name={'List view'} iconName={'list'} selected={selectedView} />
        </View>
        <VirtualizedList
          data={isLoading == 0 || arrayOfPosts.length == 0 ? Array.from(' '.repeat(20)) : arrayOfPosts}
          initialNumToRender={4}
          renderItem={({ item }) => <TouchableWithoutFeedback onPress={() => handleSelected(item.index)}><View><Post  {...item} selectedView={selectedView} selectedCardIndex={selectedCard} /></View></TouchableWithoutFeedback>}
          keyExtractor={item => item.id}
          getItemCount={(data) => data.length}
          getItem={getItem}
          onEndReached={() => getPosts(currentPage)}
          onEndReachedThreshold={0.5}
        />
      </View>
    )
  } else {
    return (
      <Error state={isLoading} />
    )
  }
}

const styles = StyleSheet.create({
  tabsView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    elevation: 5,
  }, tabIcon: {
    width: 30,
    height: 30
  }, tabText: {
    fontWeight: 'bold',
    color: '#8A56AC'
  }, selectedTabText: {
    fontWeight: 'bold',
    color: '#F1F0F2'
  }, tab: {
    backgroundColor: '#F1F0F2',
    flex: 1,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: '#8A56AC',
    borderWidth: 3,
  }, selectedTab: {
    backgroundColor: '#8A56AC',
    flex: 1,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: '#8A56AC',
    borderWidth: 3,
    elevation: 3
  }
})