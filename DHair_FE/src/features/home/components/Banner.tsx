import { Image, ScrollView, View } from 'react-native';

export default function Banner() {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 pl-4">
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#bfdbfe', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_1.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_2.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_3.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_4.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_5.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_6.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_7.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_8.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                    source={require('@/assets/img/SLIDE/slideshow_9.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
        </ScrollView>
    );
}
