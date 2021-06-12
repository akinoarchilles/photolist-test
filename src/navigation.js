import { Navigation } from "react-native-navigation";

export function pushScreen(componentId, toScreen, passProps) {
    Navigation.push(componentId, {
        component: {
            name: toScreen,
            passProps: passProps,
        }
    })
}