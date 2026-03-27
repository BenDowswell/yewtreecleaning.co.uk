export default function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Yew Tree Cleaning',
    description:
      'Reliable domestic cleaning service in Madeley and the surrounding area',
    telephone: '07799 118358',
    email: 'joy@yewtreecleaning.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Yew Tree Cottage, The Holborn',
      addressLocality: 'Madeley',
      postalCode: 'CW3 9DT',
      addressCountry: 'GB',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 52.9736,
        longitude: -2.4432,
      },
      geoRadius: '16000',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    priceRange: 'From \u00a315/hour',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
