import React from 'react';
import PropTypes from 'prop-types';

import Header from '~/components/Header';

import { Wrapper } from './styles';

export default function DefaultLayout({ children }) {
    return (
        <Wrapper>
            <Header />
            {children}
        </Wrapper>
    );
}
// Como os elementos filhos geralmente vem em formato de elemento ex: </elementofilho>
// precisamos fazer a validação dele  como elemento e não função

DefaultLayout.propTypes = {
    children: PropTypes.element.isRequired,
};
