import { Breadcrumbs } from '@mantine/core';
import { Link } from 'react-router-dom';

const BreadcrumbsComponent = ({ items }) => {
  const elements = items.map((item, index) =>
    index !== items.length - 1 ? (
      <Link href={item.href} key={index} className='text-[#4c6ef5] hover:underline'>
        {item.title}
      </Link>
    ) : (
      <span key={index}>{item.title}</span>
    )
  );

  return <Breadcrumbs>{elements}</Breadcrumbs>;
};

export default BreadcrumbsComponent;
