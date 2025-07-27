import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NoiseOverlay from '@/components/noiseBackground';

import ForumScreen from '../../screens/ForumScreen';
import HomeScreen from '../../screens/HomeScreen';
import LearnScreen from '../../screens/LearnScreen';
import ProfileScreen from '../../screens/ProfileScreen';


const Tab = createBottomTabNavigator();


const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
    <NoiseOverlay opacity={0.7} />
      <View style={styles.tabBar}>
        <NoiseOverlay opacity={0.7} />
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
              case 'Vigilaid ⚚ Home                     ⛨':
                return 'home';
              case 'Vigilaid ⚚ Learn                      ⛨':
                return 'book';
              case 'Vigilaid ⚚ Forum                    ⛨':
                return 'forum';
              case 'Vigilaid ⚚ Profile                    ⛨':
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
              <NoiseOverlay opacity={0.2} />
              <MaterialIcons
                name={getIcon()}
                size={20}
                color={isFocused ? '#530404' : '#ffffff'}
                shadowColor={isFocused ? 'transparent' : 'black'}
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
      <NoiseOverlay opacity={1.0} />
        <Tab.Navigator
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#530404',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 28,
              fontFamily: 'PoppinsBold',
            },
          }}
        >
          <Tab.Screen 
            name={"Vigilaid ⚚ Home                     ⛨"}
            component={HomeScreen as React.FC}
            options={{ tabBarLabel: 'Home' }}
          />
          <Tab.Screen 
            name="Vigilaid ⚚ Learn                      ⛨" 
            component={LearnScreen as React.FC}
            options={{ tabBarLabel: 'Learn' }}
          />
          <Tab.Screen 
            name="Vigilaid ⚚ Forum                    ⛨" 
            component={ForumScreen as React.FC}
            options={{ tabBarLabel: 'Forum' }}
          />
          <Tab.Screen 
            name="Vigilaid ⚚ Profile                    ⛨" 
            component={ProfileScreen as React.FC}
            options={{ tabBarLabel: 'Profile' }}
          />
        </Tab.Navigator>
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
    backgroundColor: '#530404',
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
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTabText: {
    color: '#530404',
    fontSize: 12,
    fontFamily: 'PoppinsBold',
    marginLeft: 4,
    marginTop: 2,
  },
});

export default App;