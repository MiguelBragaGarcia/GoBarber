import React, {useMemo} from 'react';
import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Container, Left, Avatar, Info, Name, Time} from './styles';

export default function Appointment({data, onCancel}) {
    const dateParsed = useMemo(() => {
        return formatRelative(parseISO(data.date), new Date(), {
            locale: pt,
            addSuffix: true,
        });
    }, [data.date]);

    function urlFormatted() {
        const avatarUrl = data.provider.avatar.url;
        const newAvatarUrl = avatarUrl.replace('localhost', '10.0.2.2');
        return newAvatarUrl;
    }

    return (
        <Container past={data.past}>
            <Left>
                <Avatar
                    source={{
                        uri: data.provider.avatar
                            ? urlFormatted()
                            : `https://api.adorable.io/avatars/50/${data.provider.name}.png`,
                    }}></Avatar>

                <Info>
                    <Name>{data.provider.name}</Name>
                    <Time>{dateParsed}</Time>
                </Info>
            </Left>

            {data.cancelable && !data.canceled_at && (
                <TouchableOpacity onPress={onCancel}>
                    <Icon name="event-busy" size={20} color="#f64c75"></Icon>
                </TouchableOpacity>
            )}
        </Container>
    );
}
