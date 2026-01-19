import 'react-native-gesture-handler/jestSetup'

if (!global.setImmediate) global.setImmediate = setTimeout
if (!global.clearImmediate) global.clearImmediate = clearTimeout

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}))
