import React,{useState}                       from 'react';
import { View, StyleSheet, Dimensions,Text }  from 'react-native';
import { TabView, SceneMap, TabBar }          from 'react-native-tab-view';
import { Header, Icon  }                      from 'react-native-elements';
import styles                                 from './style.js';
import {ListOfOrders}                         from './ListOfOrders.js' 
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
const initialLayout = { width: Dimensions.get('window').width };
 
export default function BookingsTabView() {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'first', title: 'New'},
    { key: 'second', title: 'Accepted'},
    { key: 'third', title: 'On The Way' },
    { key: 'fourth', title: 'Completed' },
  ]);
 
  const renderScene = ( props ) => {
    if (props.route.key == 'first' && index == 0){ 
      return <ListOfOrders status={"Ready to Dispatch"} />;
    }
    if (props.route.key == 'second' && index == 1){
      return <ListOfOrders status={"Approved"} />;
    }
    if (props.route.key == 'third' && index == 2){
      return <ListOfOrders status={"On the Way"} />;
    } 
    if (props.route.key == 'fourth' && index == 3){
      return <ListOfOrders  status={"Delivered"}/>;
    }
  };
  const getTabBarIcon = (props) => {
    const {route,focused} = props;
    let iconColor = focused ? colors.layoutColor: "#c2c3c8";
    return <Icon name='list' size={20} color={iconColor} type='font-awesome'/>
  };

  const renderTabBar = props => (
    <TabBar
      {...props}      
      indicatorStyle={{ backgroundColor: '#333' }}
      style={styles.tabviews}
      scrollEnabled    = {true}
      tabStyle={{width:100}}
      renderIcon={ props => getTabBarIcon(props)}
      renderLabel={({ route, focused, color }) => (
        <Text style={CommonStyles.normalText}>
          {route.title}
        </Text>
      )}
      pressColor={"#eee"}
    />
  );
  return (
    <React.Fragment>
      <TabView
        navigationState  =  {{ index, routes }}
        renderScene      =  {renderScene}
        renderTabBar     =  {renderTabBar}
        onIndexChange    =  {setIndex}
        initialLayout    =  {initialLayout}
        tabBarPosition   = {'bottom'}
      />
    </React.Fragment>
  );
}