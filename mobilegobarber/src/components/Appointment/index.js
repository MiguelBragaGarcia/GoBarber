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

    return (
        <Container past={data.past}>
            <Left>
                <Avatar
                    source={{
                        uri: data.provider.avatar
                            ? 'http://10.0.2.2:3330/files/64fd256744ecc8cee3b7a45517b1968b.jpg'
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
