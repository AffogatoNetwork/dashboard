import type { LinkProps } from 'next/link';
import NextLink from 'next/link';
import React from 'react';

const AnchorLink: React.FC<
  LinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
> = ({ href, ...props }) => {
  return (
    <NextLink href={href}>
      <a {...props} />
    </NextLink>
  );
};

export default AnchorLink;
