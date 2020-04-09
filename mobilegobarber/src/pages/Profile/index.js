import React, {useRef, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';
import {updateProfileRequest} from '~/store/modules/user/actions';
import {signOut} from '~/store/modules/auth/actions';
import {
    Container,
    Title,
    Separator,
    Form,
    FormInput,
    SubmitButton,
    LogoutButton,
} from './styles';

export default function Profile() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.user.profile);

    const emailRef = useRef();
    const oldPasswordRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function handleSubmit() {
        dispatch(
            updateProfileRequest({
                name,
                email,
                oldPassword,
                password,
                confirmPassword,
            }),
        );
    }

    function handleLogout() {
        dispatch(signOut());
    }

    useEffect(() => {
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
    }, [profile]);

    return (
        <Background>
            <Container>
                <Form>
                    <Title>Meu perfil</Title>
                    <FormInput
                        icon="person-outline"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Nome completo"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current.focus()}
                        value={name}
                        onChangeText={setName}></FormInput>

                    <FormInput
                        icon="mail-outline"
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Digite seu e-mail"
                        ref={emailRef}
                        returnKeyType="next"
                        onSubmitEditing={() => oldPasswordRef.current.focus()}
                        value={email}
                        onChangeText={setEmail}></FormInput>

                    <Separator></Separator>

                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Sua senha atual"
                        ref={oldPasswordRef}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current.focus()}
                        value={oldPassword}
                        onChangeText={setOldPassword}></FormInput>

                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Sua nova senha"
                        ref={passwordRef}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                            confirmPasswordRef.current.focus()
                        }
                        value={password}
                        onChangeText={setPassword}></FormInput>

                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Confirme sua senha"
                        ref={confirmPasswordRef}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}></FormInput>

                    <SubmitButton onPress={handleSubmit}>
                        Atualizar perfil
                    </SubmitButton>

                    <LogoutButton onPress={handleLogout}>
                        Sair do GoBarber
                    </LogoutButton>
                </Form>
            </Container>
        </Background>
    );
}

Profile.navigationOptions = {
    tabBarLabel: 'Meu perfil',
    tabBarIcon: ({tintColor}) => (
        <Icon name="person" size={20} color={tintColor}></Icon>
    ),
};
