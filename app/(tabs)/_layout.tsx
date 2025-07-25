import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import ForumScreen from '../../screens/ForumScreen';
import HomeScreen from '../../screens/HomeScreen';
import LearnScreen from '../../screens/LearnScreen';
import ProfileScreen from '../../screens/ProfileScreen';


const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIcon = () => {
            switch (route.name) {
              case 'Home':
                return 'home';
              case 'Learn':
                return 'book';
              case 'Forum':
                return 'forum';
              case 'Profile':
                return 'person';
              default:
                return 'home';
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.activeTabItem
              ]}
            >
              <MaterialIcons
                name={getIcon()}
                size={20}
                color={isFocused ? '#FFFFFF' : '#6b6b6b'}
              />
              {isFocused && (
                <Text style={styles.activeTabText}>{label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const App = () => {     
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#B92D29" />
      
      <View style={{ flex: 1 }}>
        <LinearGradient colors={['#ffe5e5', '#fff0f0','#ffcccc']}
            style={StyleSheet.absoluteFill} 
            start={{ x:0, y:0}}
            end={{x:1,y:1}}/>

        <Tab.Navigator
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#B92D29',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen as React.FC}
            options={{ tabBarLabel: 'Home' }}
          />
          <Tab.Screen 
            name="Learn" 
            component={LearnScreen as React.FC}
            options={{ tabBarLabel: 'Learn' }}
          />
          <Tab.Screen 
            name="Forum" 
            component={ForumScreen as React.FC}
            options={{ tabBarLabel: 'Forum' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen as React.FC}
            options={{ tabBarLabel: 'Profile' }}
          />
        </Tab.Navigator>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'space-between',
    minHeight: 50,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  activeTabItem: {
    backgroundColor: '#B92D29',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default App;