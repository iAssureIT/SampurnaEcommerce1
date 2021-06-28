import React      from 'react';
import PropTypes  from 'prop-types';
import { View, 
        ActivityIndicator, 
        Image }   from 'react-native';
// import styles from './styles';
import styles     from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
import ContentLoader, { Rect, Circle }  from 'react-content-loader/native';
const Loading = (props) => {
  if(props.type && props.loader && props.type=="HList"){
    return (
      <View style={[styles.container,{flexDirection:"row"}]}>
            <ContentLoader 
              speed={0.5}
              width={400}
              height={150}
              viewBox="0 0 400 150"
              // backgroundColor="#f3f3f  3"
              foregroundColor="#eee"
              {...props}
            >
              <Rect x="2" y="2" rx="0" ry="0" width="135" height="142" /> 
              <Rect x="155" y="3" rx="0" ry="0" width="135" height="142" /> 
              <Rect x="307" y="2" rx="0" ry="0" width="135" height="142" />
        </ContentLoader>
    </View>
    );
  }else{
    return (
      <View style={styles.container}>
        <ActivityIndicator style={{height:'100%'}} size="large" color={colors.theme} />
      </View>
    );
  }
};

Loading.propTypes = {
  size: PropTypes.string,
};

Loading.defaultProps = {
  size: 'large',
};

export default Loading;
