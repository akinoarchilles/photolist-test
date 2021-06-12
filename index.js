import { Navigation } from "react-native-navigation";
import Favorites from "./src/screens/Favorites";
import PhotoDetail from "./src/screens/PhotoDetail";
import Photolist from './src/screens/PhotoList';

Navigation.registerComponent('PhotoList', () => Photolist);
Navigation.registerComponent('Favorites', () => Favorites);
Navigation.registerComponent('PhotoDetail', () => PhotoDetail);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    topBar: {
        noBorder: true,
        elevation: 0,
        background: {
            color: 'lightblue'
        },
        title: {
            fontSize: 20,
            color: 'black',
            alignment: 'center',
            fontWeight: 'bold'
        },
        backButton: {
            color: 'black',
            visible: true,
            showTitle: false
        },
    },
    layout: {
        orientation: ['portrait']
    }
  });
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
               name: 'PhotoList'
             }
           }
         ]
       }
     }
  });
});