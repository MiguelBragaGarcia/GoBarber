import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, Content } from './styles';

export default function AuthLayout({ children }) {
    return (
        <Wrapper>
            <Content>{children}</Content>
        </Wrapper>
    );
}
// Como os elementos filhos geralmente vem em formato de elemento ex: </elementofilho>
// precisamos fazer a validação dele  como elemento e não função

AuthLayout.propTypes = {
    children: PropTypes.element.isRequired,
};
