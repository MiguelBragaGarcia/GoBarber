import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

/* O ~ é uma implementação dos módulos  customize-cra, react-app-rewired (O ultimo usado nos scrips do pakage.json) e babel-plugin-root-import
Que facilita ao importar ao invés de usarmos o ../ para  voltar até a raiz do projeto
partimos diretamente da raiz (SRC) e vamos até onde desejamos usando o  ~
Tem que confiurar no arquivo config-overrides.js */
import AuthLayout from '~/pages/_layouts/auth';
import Defaultayout from '~/pages/_layouts/default';

import { store } from '~/store/';

export default function RouteWrapper({
    component: Component,
    isPrivate, // Foi criada mais uma propriedade passada aos componentes
    ...rest
}) {
    const { signed } = store.getState().auth;

    // Caso o usuário não esteja logado e a rota que está acessando é privada redireciona
    // para o / que é a rota de login
    if (!signed && isPrivate) {
        return <Redirect to="/">/</Redirect>;
    }

    // Caso o usuário esteja logado e tentando acessar página não privadas (login/registrar) redireciona ele para
    // dashboard
    if (signed && !isPrivate) {
        return <Redirect to="/dashboard" />;
    }

    // Carrega o layout com base se o usuário está logado ou não
    const Layout = signed ? Defaultayout : AuthLayout;

    return (
        <Route
            {...rest}
            render={props => (
                <Layout>
                    <Component {...props} />
                </Layout>
            )}
        />
    );
}
// Valida as entrada com o PropTypes
RouteWrapper.propTypes = {
    isPrivate: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
        .isRequired,
};
// Define como padrão o valor da propriedade isPrivate
RouteWrapper.defaultProps = {
    isPrivate: false,
};
