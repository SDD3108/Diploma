import React from 'react'
import '@/i18n'
import { useTranslation } from 'react-i18next'

const AgreementPageBuilder = () => {
  const { t } = useTranslation('common')
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t('agreement.title')}</h1>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-2">{t('agreement.section1.title')}</h2>
          <p>{t('agreement.section1.p1')}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-2">{t('agreement.section2.title')}</h2>
          <p>{t('agreement.section2.p1')}</p>
          <p>{t('agreement.section2.p2')}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-2">{t('agreement.section3.title')}</h2>
          <p>{t('agreement.section3.p1')}</p>
          <p>{t('agreement.section3.p2')}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-2">{t('agreement.section4.title')}</h2>
          <p>{t('agreement.section4.p1')}</p>
          <ul className="list-disc pl-6">
            <li>{t('agreement.section4.li1')}</li>
            <li>{t('agreement.section4.li2')}</li>
            <li>{t('agreement.section4.li3')}</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-2">{t('agreement.section5.title')}</h2>
          <p>{t('agreement.section5.p1')}</p>
          <ul className="list-disc pl-6">
            <li>{t('agreement.section5.li1')}</li>
            <li>{t('agreement.section5.li2')}</li>
            <li>{t('agreement.section5.li3')}</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-2">{t('agreement.section6.title')}</h2>
          <p>{t('agreement.section6.p1')}</p>
          <p>{t('agreement.section6.p2')}</p>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>{t('agreement.effectiveDate')}</p>
          <p>{t('agreement.contacts')}</p>
        </div>
      </div>
    </div>
  )
}

export default AgreementPageBuilder