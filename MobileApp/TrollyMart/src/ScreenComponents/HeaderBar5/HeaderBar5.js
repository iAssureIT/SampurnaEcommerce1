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
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';
import {colors} from '../../AppDesigns/currentApp/styles/styles.js';
import Search from 'react-native-search-box';


export default  class HeaderBar5 extends ValidationComponent {
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

  UNSAFE_componentWillReceiveProps(nextProps) {
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
        backgroundColor={colors.theme}
        // placement="left"
        leftContainerStyle={{backgroundColor:'transparent',paddingHorizontal:15}}
        centerContainerStyle={{backgroundColor:'transparent',paddingLeft:0,paddingRight:0,paddingTop:0}}
        rightContainerStyle={{backgroundColor:'transparent',paddingHorizontal:15}}
        leftComponent={
                  <TouchableOpacity onPress={()=>  this.props.goBack(null)}>
                    <View style={{justifyContent:'center',alignItems:'center',marginTop:10,alignSelf:'center'}}>
                      <Icon size={30} name='keyboard-arrow-left' type='MaterialIcons' color='#fff' />
                    </View>
                  </TouchableOpacity>
        }
        centerComponent={ <Text style={[{fontSize:18,color:'#fff',fontFamily:"Montserrat-SemiBold",textAlign:'center',alignSelf:'center',marginTop:8}]}>{headerTitle}</Text>}
     
       
        containerStyle={{paddingTop:0,paddingLeft:0,paddingRight:0,backgroundColor:colors.theme}}
      />
      
    );
  }
}
