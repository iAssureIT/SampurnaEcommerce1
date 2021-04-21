import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { Header, Icon ,SearchBar  } from 'react-native-elements';
import ValidationComponent from "react-native-form-validator";
// import styles from "./styles.js";
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/HeaderBar4Styles.js';
import {colors} from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import Search from 'react-native-search-box';


export default  class HeaderBar4 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      headerTitle:'',
      searchText:''
    }
  }

  _goBack = () =>{
    this.props.goBack();
  }
  
  UNSAFE_componentWillMount() {
   
  }

    handleNavigation = (screen) =>{
      this.props.navigate(screen);

  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if(nextProps){
      this.setState({
        count:parseInt(nextProps.count)
      })
    }
  }
  updateSearch = searchText => {
    this.setState({ searchText });
  };

  componentWillUnmount() {
  }

  render() {
    const { goBack, headerTitle } = this.props;
    console.log(this.props)
    return (
      <Header 
        backgroundColor={'transparent'}
        placement="left"
        leftContainerStyle={{backgroundColor:'transparent',paddingHorizontal:15}}
        centerContainerStyle={{backgroundColor:'transparent',paddingLeft:0,paddingRight:0,paddingTop:0}}
        rightContainerStyle={{backgroundColor:'transparent',paddingHorizontal:15}}
        leftComponent={
                  <TouchableOpacity onPress={()=>  this.props.goBack(null)}>
                    <View style={{justifyContent:'center',alignItems:'center',marginTop:10,alignSelf:'center'}}>
                      <Icon size={30} name='keyboard-arrow-left' type='MaterialIcons' color='#333' />
                    </View>
                  </TouchableOpacity>
        }
        centerComponent={ <Text style={[{fontSize:18,color:'#333',fontFamily:"Montserrat-SemiBold",textAlign:'center',alignSelf:'center',marginTop:8}]}>{headerTitle}</Text>}
     
        rightComponent={
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,alignSelf:'center',marginRight:20}}>
                  <Icon name="bell-o" type="font-awesome" size={23}  color="#333" style={styles.bellIcon}/>
                  <Text style={styles.notificationText}>{0}</Text>
              </View>
            </TouchableOpacity>
           {/* <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,alignSelf:'center'}}>
              <TouchableOpacity >
                <Icon name="shopping-cart" type="feather" size={25}  color="#333" style={styles.bellIcon}/>
                <Text style={styles.notificationText}>{2}</Text>
              </TouchableOpacity>
            </View>*/}
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,alignSelf:'center',marginLeft:18}}>
              <TouchableOpacity >
                <Icon name="search" type="feather" size={25}  color="#333"/>
              </TouchableOpacity>
            </View>
          </View>
        }
        containerStyle={{paddingTop:0,paddingLeft:0,paddingRight:0,backgroundColor:'#fff'}}
      />
      
    );
  }
}
