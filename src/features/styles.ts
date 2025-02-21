import _ from "lodash";
import { CSSProperties } from "react";
import styled from "styled-components";

interface StylesProps {
  style?: {
    hover?: CSSProperties;
    [key: string]: any;
  };
}

export const CsStrong = styled.strong<{ gradient?: string }>`
  ${(props) =>
    props.gradient
      ? `
  background: linear-gradient(${props.gradient});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
      : ""}
`;

const flexCenter = {
  display: "flex",
  "align-items": "center",
  "justify-content": "center",
};

export const CsDiv = styled.div<StylesProps>`
  ${(props) =>
    _.get(props, "style.after")
      ? Object.entries(flexCenter)
          .map(([key, value]) => `${key}: ${value};`)
          .join("\n")
      : ""}

  &:hover {
    ${(props) =>
      props.style?.hover
        ? Object.entries(props.style.hover)
            .map(([key, value]) => `${key}: ${value} !important;`)
            .join("\n")
        : ""}
  }

  &::before {
    ${(props) =>
      props.style?.before
        ? Object.entries(props.style.before)
            .map(([key, value]) => `${key}: ${value};`)
            .join("\n")
        : ""}
  }

  &::after {
    ${(props) =>
      props.style?.after
        ? Object.entries(props.style.after)
            .map(([key, value]) => `${key}: ${value};`)
            .join("\n")
        : ""}
  }
`;
