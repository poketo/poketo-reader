// @flow

import React from 'react';
import styled, { css } from 'react-emotion/macro';

type Props = {
  className?: string,
  series: {
    coverImageUrl: ?string,
    title: string,
  },
  variant?: 'small' | 'medium' | 'large',
};

const StyledContainerContainer = styled.div`
  ${props => {
    switch (props.variant) {
      case 'small':
        return css`
          max-width: 60px;
          @media only screen and (min-width: 768px) {
            max-width: 80px;
          }
        `;
      case 'medium':
        return css`
          max-width: 80px;
          @media only screen and (min-width: 768px) {
            max-width: 120px;
          }
        `;
      case 'large':
      default:
        return '';
    }
  }};
  flex: 1 0 50%;
`;

const StyledContainer = styled.div`
  background-color: #f2f2f2;
  background-image: url('data:image/svg+xml,<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h24v24h-24z" fill="none"/><g stroke="#999" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m19 3h-14c-1.10457 0-2 .89543-2 2v14c0 1.1046.89543 2 2 2h14c1.1046 0 2-.8954 2-2v-14c0-1.10457-.8954-2-2-2z"/><path d="m8.5 10c.82843 0 1.5-.67157 1.5-1.5s-.67157-1.5-1.5-1.5-1.5.67157-1.5 1.5.67157 1.5 1.5 1.5z"/><path d="m21 15-5-5-11 11"/></g></svg>');
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  position: relative;
  height: 0;
  padding-bottom: 140%;
  overflow: hidden;
`;

const StyledImage = styled.div`
  background-image: url(${props => props.imageUrl});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const StyledFill = styled.div`
  box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, 0.25);
`;

const SeriesCoverImage = ({ series, ...props }: Props) => (
  <StyledContainerContainer {...props}>
    <StyledContainer role="img" aria-label={series.title}>
      {series.coverImageUrl && (
        <StyledImage className="p-fill" imageUrl={series.coverImageUrl} />
      )}
      <StyledFill className="p-fill" />
    </StyledContainer>
  </StyledContainerContainer>
);

SeriesCoverImage.defaultProps = {
  variant: 'large',
};

export default SeriesCoverImage;
