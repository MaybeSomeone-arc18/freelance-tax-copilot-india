// Seed content. Every fact here was read from the linked official source.
const ref = (id) => ({_type: 'reference', _ref: id})
const refs = (...ids) => ids.map((id) => ({_type: 'reference', _ref: id, _key: id}))
const k = (arr) => arr.map((x, i) => ({...x, _key: `k${i}`}))
const today = '2026-09-25'

export const docs = [
  // --- tax years
  {_id: 'ty-2025-26', _type: 'taxYear', label: 'FY 2025-26', code: '2025-26', startDate: '2025-04-01', endDate: '2026-03-31', incomeTaxLaw: ref('statute-ita-1961'), assessmentYearLabel: 'AY 2026-27', notes: 'Last year under the Income-tax Act, 1961.'},
  {_id: 'ty-2026-27', _type: 'taxYear', label: 'FY 2026-27', code: '2026-27', startDate: '2026-04-01', endDate: '2027-03-31', incomeTaxLaw: ref('statute-ita-2025'), notes: 'First "tax year" under the Income-tax Act, 2025. The 2025 Act does not use "assessment year".'},

  // --- sources
  {_id: 'src-ita-2025', _type: 'sourceDocument', title: 'Income-tax Act, 2025 (as amended by Finance Act, 2026)', issuer: 'Parliament / Income Tax Department', authority: 'statute', url: 'https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf', retrievedOn: today, publishedOn: '2026-04-01', reference: 'Official Income Tax Department PDF (SHA-256 d54a0ed6...998b, 3,299,341 bytes) - seeded provisions re-checked against this copy on 25 Sep 2026', summary: 'Full text of the new Act. In force from 1 April 2026.'},
  {_id: 'src-cgst-act', _type: 'sourceDocument', title: 'Central Goods and Services Tax Act, 2017 (CBIC updated copy)', issuer: 'CBIC', authority: 'statute', url: 'https://cbic-gst.gov.in/pdf/CGST-Act-Updated-30092020.pdf', retrievedOn: today},
  {_id: 'src-igst-s2', _type: 'sourceDocument', title: 'IGST Act, 2017 - section 2 (current text)', issuer: 'CBIC tax information portal', authority: 'statute', url: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_IGST_Act/active/chapteri/section2_v1.00.html', retrievedOn: today},
  {_id: 'src-igst-s16', _type: 'sourceDocument', title: 'IGST Act, 2017 - section 16 zero rated supply (current text)', issuer: 'CBIC tax information portal', authority: 'statute', url: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_IGST_Act/active/chaptervii/section16_v1.00.html', retrievedOn: today, summary: 'Sub-section (3) substituted by Finance Act 2021, in force 1 Oct 2023 (Notification 27/2023-Central Tax).'},
  {_id: 'src-rule-96a', _type: 'sourceDocument', title: 'CGST Rules, 2017 - rule 96A (export under bond / LUT)', issuer: 'CBIC tax information portal', authority: 'notification', url: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter10/rule96a_v1.00.html', retrievedOn: today},
  {_id: 'src-gst-reg-flyer', _type: 'sourceDocument', title: 'Registration under GST Law (flyer)', issuer: 'GST Council', authority: 'official-guide', url: 'https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Registration_under_GST_Law_new.pdf', retrievedOn: today},
  {_id: 'src-notif-10-2017-it', _type: 'sourceDocument', title: 'Notification No. 10/2017-Integrated Tax (13 Oct 2017) - agenda note copy', issuer: 'GST Council', authority: 'notification', reference: 'Notification 10/2017-Integrated Tax', publishedOn: '2017-10-13', url: 'https://gstcouncil.gov.in/sites/default/files/Agenda/Table%20Agenda%20Note%20No-1.pdf', retrievedOn: today, summary: 'Exempts persons making inter-State supplies of taxable services from compulsory registration if aggregate turnover is below the threshold.'},
  {_id: 'src-igst-2017-original', _type: 'sourceDocument', title: 'IGST Act, 2017 as originally enacted (GST Council PDF)', issuer: 'GST Council', authority: 'statute', url: 'https://gstcouncil.gov.in/sites/default/files/IGST.pdf', retrievedOn: today, summary: 'Original 2017 text. Superseded in parts by later amendments - kept to show what older guides are based on.'},

  // --- statutes
  {_id: 'statute-ita-1961', _type: 'statute', name: 'Income-tax Act, 1961', shortName: 'ITA 1961', taxType: 'income-tax', inForceUntil: '2026-03-31', replacedBy: ref('statute-ita-2025')},
  {_id: 'statute-ita-2025', _type: 'statute', name: 'Income-tax Act, 2025', shortName: 'ITA 2025', taxType: 'income-tax', inForceFrom: '2026-04-01', officialSource: ref('src-ita-2025')},
  {_id: 'statute-cgst', _type: 'statute', name: 'Central Goods and Services Tax Act, 2017', shortName: 'CGST Act', taxType: 'gst', inForceFrom: '2017-07-01', officialSource: ref('src-cgst-act')},
  {_id: 'statute-igst', _type: 'statute', name: 'Integrated Goods and Services Tax Act, 2017', shortName: 'IGST Act', taxType: 'gst', inForceFrom: '2017-07-01', officialSource: ref('src-igst-s2')},
]

const P = (id, statute, section, heading, source, extra = {}) => ({_id: id, _type: 'provision', statute: ref(statute), section, heading, source: ref(source), ...extra})
const old = (sec, heading) => P(`prov-1961-${sec.toLowerCase()}`, 'statute-ita-1961', sec, heading, 'src-ita-2025', {pinpoint: 'Tabular Mapping - Sections of the Income-tax Act, 2025 vis-a-vis Income-tax Act, 1961', plainEnglish: 'Old-law section. Applies up to FY 2025-26. Listed in the 2025 Act\'s own mapping table.'})

docs.push(
  old('44AD', 'Presumptive taxation - business'),
  old('44ADA', 'Presumptive taxation - professionals'),
  old('44AE', 'Presumptive taxation - goods carriages'),
  old('44AA', 'Maintenance of books of account'),
  old('44AB', 'Tax audit'),
  old('87A', 'Rebate for certain individuals'),
  old('115BAC', 'New tax regime'),
  old('194J', 'TDS on fees for professional or technical services'),
  old('208', 'Conditions of liability to pay advance tax'),
  old('211', 'Instalments of advance tax'),
  old('234C', 'Interest for deferment of advance tax'),

  P('prov-2025-58', 'statute-ita-2025', '58', 'Presumptive basis for certain residents', 'src-ita-2025', {
    correspondsTo: refs('prov-1961-44ad', 'prov-1961-44ada', 'prov-1961-44ae'),
    pinpoint: 's.58(2), Table Sl. No. 1 and 3',
    excerpt: 'Sl. 3: Specified profession as referred to in section 62(4) | Specified assessee | (a) does not exceed fifty lakh rupees; or (b) does not exceed seventy-five lakh rupees, where the amount or aggregate of amounts received in cash does not exceed 5% of the gross receipts | 50% of the gross receipts or profit claimed to have been actually earned, whichever is higher.',
    plainEnglish: 'A resident professional with gross receipts up to ₹50 lakh (₹75 lakh if cash receipts are 5% or less) can declare 50% of receipts as profit. Businesses: up to ₹2 crore (₹3 crore if cash is 5% or less) at 6% of digital receipts and 8% of the rest.',
  }),
  P('prov-2025-62-4', 'statute-ita-2025', '62(4)', 'Meaning of "specified profession"', 'src-ita-2025', {
    correspondsTo: refs('prov-1961-44aa'),
    excerpt: '"specified profession" means (a) legal, medical, engineering, architectural, accountancy, technical consultancy, interior decoration, information technology or company secretary; or (b) any other profession, as may be notified by the Board in this behalf.',
    plainEnglish: 'Information technology is named directly in the list, so an IT freelancer is inside the professional presumptive scheme.',
  }),
  P('prov-2025-63', 'statute-ita-2025', '63', 'Tax audit', 'src-ita-2025', {correspondsTo: refs('prov-1961-44ab')}),
  P('prov-2025-156', 'statute-ita-2025', '156', 'Rebate of income-tax in case of certain individuals', 'src-ita-2025', {
    correspondsTo: refs('prov-1961-87a'),
    excerpt: '(2) Where the total income of a resident individual is chargeable to tax under section 202(1) ... (a) the income does not exceed twelve lakh rupees, 100% of the income-tax payable or ₹60000, whichever is less; (b) [marginal relief above twelve lakh]. (1) [old regime] 100% of tax or ₹12500, whichever is less, if total income does not exceed ₹500000.',
    plainEnglish: 'Under the default (new) regime a resident individual pays no tax if total income is ₹12 lakh or less; just above ₹12 lakh, tax cannot exceed the income over ₹12 lakh.',
  }),
  P('prov-2025-202', 'statute-ita-2025', '202', 'New tax regime for individuals, HUF and others', 'src-ita-2025', {
    correspondsTo: refs('prov-1961-115bac'),
    excerpt: 'Upto ₹400000 Nil; ₹400001-₹800000 5%; ₹800001-₹1200000 10%; ₹1200001-₹1600000 15%; ₹1600001-₹2000000 20%; ₹2000001-₹2400000 25%; above ₹2400000 30%.',
    plainEnglish: 'These slabs apply by default. A person with business or professional income can opt out under s.202(4), on or before the return due date.',
  }),
  P('prov-2025-393', 'statute-ita-2025', '393(1) Table Sl. 6', 'TDS - fees for professional and technical services', 'src-ita-2025', {
    correspondsTo: refs('prov-1961-194j'),
    excerpt: '(iii) fees for professional services ... Rate: (a) 2% [fees for technical services (not being professional services), certain film royalty, call centre payee]; (b) 10% of such sum in cases other than (a). Threshold limit: for (a), (b), (d) and (e) of Col. B: ₹50,000; for (c) of Col. B [director remuneration]: Nil.',
    plainEnglish: 'A "specified person" (typically a business client in India) paying a freelancer for professional services deducts 10% TDS once payments cross ₹50,000 in the tax year (technical services: 2%). Individual/HUF clients outside Sl. 6(iii) fall under Sl. 6(ii): 2%, only above ₹50 lakh. Foreign clients do not deduct Indian TDS under this entry.',
  }),
  P('prov-2025-404', 'statute-ita-2025', '404', 'Conditions of liability to pay advance tax', 'src-ita-2025', {correspondsTo: refs('prov-1961-208'), excerpt: 'Advance tax shall be payable ... where the amount of such tax payable during that year ... is ₹10000 or more.'}),
  P('prov-2025-408', 'statute-ita-2025', '408', 'Instalments of advance tax and due dates', 'src-ita-2025', {
    correspondsTo: refs('prov-1961-211'),
    excerpt: 'Instalments: 15 June not less than 15%; 15 September 45%; 15 December 75%; 15 March whole amount. (2) An assessee who declares profits and gains as per section 58(2) (Table: Sl. No. 1 or 3) shall pay the whole amount of advance tax ... on or before the 15th March.',
  }),
  P('prov-2025-425', 'statute-ita-2025', '425', 'Interest for deferment of advance tax', 'src-ita-2025', {correspondsTo: refs('prov-1961-234c')}),

  P('prov-cgst-2-6', 'statute-cgst', '2(6)', 'Aggregate turnover', 'src-cgst-act', {excerpt: '"aggregate turnover" means the aggregate value of all taxable supplies (excluding the value of inward supplies on which tax is payable by a person on reverse charge basis), exempt supplies, exports of goods or services or both and inter-State supplies of persons having the same Permanent Account Number, to be computed on all India basis but excludes central tax, State tax, Union territory tax, integrated tax and cess;', plainEnglish: 'Export income counts toward the GST registration threshold.'}),
  P('prov-cgst-22', 'statute-cgst', '22(1)', 'Persons liable for registration', 'src-cgst-act', {excerpt: 'Every supplier shall be liable to be registered ... if his aggregate turnover in a financial year exceeds twenty lakh rupees: Provided that ... special category States ... ten lakh rupees ...'}),
  P('prov-igst-2-6', 'statute-igst', '2(6)', 'Export of services', 'src-igst-s2', {excerpt: '"export of services" means the supply of any service when,- (i) the supplier of service is located in India; (ii) the recipient of service is located outside India; (iii) the place of supply of service is outside India; (iv) the payment for such service has been received by the supplier of service in convertible foreign exchange [or in Indian rupees wherever permitted by the Reserve Bank of India]; and (v) the supplier of service and the recipient of service are not merely establishments of a distinct person ...'}),
  P('prov-igst-16', 'statute-igst', '16', 'Zero rated supply', 'src-igst-s16', {excerpt: '(3) A registered person making zero rated supply shall be eligible to claim refund of unutilised input tax credit on supply of goods or services or both, without payment of integrated tax, under bond or Letter of Undertaking ... (4) The Government may ... by notification, specify (i) a class of persons who may make zero rated supply on payment of integrated tax and claim refund ...', plainEnglish: 'Since 1 October 2023 the default route for exporters is: export without paying IGST under an LUT. Paying IGST and claiming it back is only for notified classes.'}),
  P('prov-rule-96a', 'statute-cgst', 'Rule 96A (CGST Rules)', 'Export under bond or Letter of Undertaking', 'src-rule-96a', {excerpt: 'Any registered person availing the option to supply goods or services for export without payment of integrated tax shall furnish, prior to export, a bond or a Letter of Undertaking in FORM GST RFD-11 ...'}),
)

const R = (id, o) => ({_id: id, _type: 'rule', validFrom: ref('ty-2026-27'), ...o, conditions: o.conditions ? k(o.conditions) : undefined, amounts: o.amounts ? k(o.amounts) : undefined, provisions: refs(...o.provisions), sources: refs(...o.sources)})

docs.push(
  R('rule-presumptive-profession-2026', {
    title: 'Presumptive tax for professionals (50% of receipts)', topic: 'presumptive', appliesTo: ['resident-individual', 'freelance-professional'],
    statement: 'A resident carrying on a specified profession (including information technology) can declare 50% of gross receipts as profit, or more if actually earned, when gross receipts in the tax year are up to ₹50 lakh, or up to ₹75 lakh if cash receipts are 5% or less of gross receipts.',
    conditions: [
      {fact: 'residentialStatus', operator: '==', value: 'resident'},
      {fact: 'profession', operator: 'in', value: 'legal, medical, engineering, architectural, accountancy, technical consultancy, interior decoration, information technology, company secretary, notified', explain: 's.62(4)'},
      {fact: 'grossReceipts', operator: '<=', value: '7500000', explain: '₹50 lakh, or ₹75 lakh if cash share <= 5%'},
    ],
    amounts: [{label: 'Receipts limit', inr: 5000000}, {label: 'Receipts limit if cash <= 5%', inr: 7500000}, {label: 'Deemed profit', percent: 50}, {label: 'Cash receipts cap for higher limit', percent: 5}],
    provisions: ['prov-2025-58', 'prov-2025-62-4'], sources: ['src-ita-2025'],
    gotchas: ['For FY 2026-27 onward cite section 58 of the Income-tax Act, 2025, not 44ADA.', 'The ₹75 lakh limit only works if cash receipts are 5% or less of gross receipts.', 'Profit is 50% or actual profit, whichever is higher - you cannot declare less than 50% under this section.'],
  }),
  R('rule-new-regime-slabs-2026', {
    title: 'Default (new regime) slab rates', topic: 'slabs', appliesTo: ['resident-individual'],
    statement: 'Individuals are taxed by default at: up to ₹4 lakh nil; ₹4-8 lakh 5%; ₹8-12 lakh 10%; ₹12-16 lakh 15%; ₹16-20 lakh 20%; ₹20-24 lakh 25%; above ₹24 lakh 30%. Opting out is possible under s.202(4).',
    amounts: [{label: 'Nil slab up to', inr: 400000}, {label: '5% slab up to', inr: 800000}, {label: '10% slab up to', inr: 1200000}, {label: '15% slab up to', inr: 1600000}, {label: '20% slab up to', inr: 2000000}, {label: '25% slab up to', inr: 2400000}, {label: 'Top rate', percent: 30}],
    provisions: ['prov-2025-202'], sources: ['src-ita-2025'],
    gotchas: ['Rates here exclude health and education cess and surcharge.'],
  }),
  R('rule-rebate-12l-2026', {
    title: 'Zero tax up to ₹12 lakh (rebate, new regime)', topic: 'slabs', appliesTo: ['resident-individual'],
    statement: 'A resident individual taxed under the default regime gets a rebate of the full tax (max ₹60,000) if total income is ₹12 lakh or less. Just above ₹12 lakh, marginal relief caps tax at the income over ₹12 lakh.',
    conditions: [{fact: 'taxRegime', operator: '==', value: 'new'}, {fact: 'residentialStatus', operator: '==', value: 'resident'}, {fact: 'totalIncome', operator: '<=', value: '1200000'}],
    amounts: [{label: 'Income limit', inr: 1200000}, {label: 'Max rebate', inr: 60000}],
    provisions: ['prov-2025-156'], sources: ['src-ita-2025'],
    gotchas: ['Under presumptive tax, total income is 50% of receipts - so ₹24 lakh of professional receipts can mean ₹12 lakh of income.'],
  }),
  R('rule-tds-professional-2026', {
    title: 'TDS on professional fees: 10% above ₹50,000', topic: 'tds', appliesTo: ['freelance-professional'],
    statement: 'A specified payer paying fees for professional services deducts tax at 10% (2% for fees for technical services that are not professional services) once the amount crosses ₹50,000.',
    amounts: [{label: 'Threshold', inr: 50000}, {label: 'Rate - professional services', percent: 10}, {label: 'Rate - technical services', percent: 2}],
    provisions: ['prov-2025-393'], sources: ['src-ita-2025'],
    gotchas: ['Foreign clients do not deduct Indian TDS - this is about Indian payers.', 'TDS deducted is credited against your final tax; it is not an extra tax.'],
  }),
  R('rule-advance-tax-2026', {
    title: 'Advance tax: when it applies and due dates', topic: 'advance-tax', appliesTo: ['resident-individual', 'freelance-professional'],
    statement: 'Advance tax is payable when tax for the year is ₹10,000 or more: 15% by 15 June, 45% by 15 September, 75% by 15 December, 100% by 15 March. Anyone declaring income under s.58 (presumptive) pays the whole amount by 15 March.',
    amounts: [{label: 'Liability threshold', inr: 10000}],
    provisions: ['prov-2025-404', 'prov-2025-408', 'prov-2025-425'], sources: ['src-ita-2025'],
    gotchas: ['Presumptive filers get one instalment (15 March), not four.', 'Missing instalments attracts interest under s.425 (old s.234C).'],
  }),
  R('rule-gst-registration-services', {
    title: 'GST registration threshold for service providers', topic: 'gst-registration', appliesTo: ['freelance-professional', 'service-exporter'],
    validFrom: ref('ty-2025-26'),
    statement: 'A supplier of services must register for GST once aggregate turnover in a financial year exceeds ₹20 lakh (₹10 lakh in Manipur, Mizoram, Nagaland, Tripura). Aggregate turnover includes exports. Service suppliers below the threshold do not need registration even for inter-State supplies.',
    conditions: [{fact: 'aggregateTurnover', operator: '>', value: '2000000', explain: 'includes exports, all-India per PAN'}],
    amounts: [{label: 'Threshold (services)', inr: 2000000}, {label: 'Threshold (special category States)', inr: 1000000}],
    provisions: ['prov-cgst-22', 'prov-cgst-2-6'], sources: ['src-cgst-act', 'src-gst-reg-flyer', 'src-notif-10-2017-it'],
    gotchas: ['Export receipts count toward the ₹20 lakh threshold even though exports are zero-rated.', 'Being an inter-State (or export) supplier does not by itself force registration for services.'],
  }),
  R('rule-export-of-services', {
    title: 'When a freelance gig counts as "export of services"', topic: 'gst-export', appliesTo: ['service-exporter'],
    validFrom: ref('ty-2025-26'),
    statement: 'A supply is an export of services only if all five hold: supplier in India, recipient outside India, place of supply outside India, payment received in convertible foreign exchange or in Indian rupees where RBI permits, and the two are not merely establishments of the same person.',
    conditions: [{fact: 'supplierLocation', operator: '==', value: 'India'}, {fact: 'recipientLocation', operator: '!=', value: 'India'}, {fact: 'placeOfSupply', operator: '!=', value: 'India'}, {fact: 'paymentCurrency', operator: 'in', value: 'convertible foreign exchange, INR where RBI permits'}],
    provisions: ['prov-igst-2-6'], sources: ['src-igst-s2'],
  }),
  R('rule-zero-rated-lut', {
    title: 'Export without paying GST: file an LUT', topic: 'gst-export', appliesTo: ['service-exporter'],
    validFrom: ref('ty-2025-26'),
    statement: 'Exports are zero-rated. A registered exporter supplies without paying IGST by furnishing a Letter of Undertaking (FORM GST RFD-11) before exporting, and can claim refund of unutilised input tax credit. Since 1 October 2023, paying IGST and claiming it back is only available to classes notified by the government.',
    provisions: ['prov-igst-16', 'prov-rule-96a'], sources: ['src-igst-s16', 'src-rule-96a'],
    gotchas: ['File the LUT before the first export invoice of the year.', 'Older guides describe "pay IGST and claim refund" as a free choice - that changed on 1 October 2023.'],
  }),
)

const C = (id, o) => ({_id: id, _type: 'conflict', status: 'resolved', ...o})
docs.push(
  C('conflict-44ada-vs-58', {title: '"Freelancers file under section 44ADA" (for FY 2026-27)', claim: 'Professionals use section 44ADA for presumptive taxation.', correct: 'For FY 2026-27 onward the Income-tax Act, 2025 applies; the same scheme is in section 58 (Table Sl. No. 3). 44ADA is correct only up to FY 2025-26.', winningRule: ref('rule-presumptive-profession-2026'), why: 'The 1961 Act stopped applying from 1 April 2026; the 2025 Act\'s own mapping table puts 44ADA under section 58.'}),
  C('conflict-igst-refund-option', {title: '"Exporters can pay IGST and claim a refund, or use an LUT"', claim: 'Every exporter can choose between LUT and paying IGST with refund.', correct: 'Since 1 October 2023, IGST s.16(3) allows zero-rating without payment under bond/LUT; paying IGST and claiming refund is only for notified classes under s.16(4).', winningRule: ref('rule-zero-rated-lut'), why: 'Finance Act 2021 substituted s.16(3), in force from 1 Oct 2023 (Notification 27/2023-CT). Guides written earlier describe the old two-option text.'}),
  C('conflict-export-currency', {title: '"Export payment must be in foreign currency"', claim: 'Payment must be received in convertible foreign exchange.', claimSource: ref('src-igst-2017-original'), correct: 'Current s.2(6)(iv) also accepts payment in Indian rupees wherever permitted by the Reserve Bank of India.', winningRule: ref('rule-export-of-services'), why: 'Newer amended text beats the original 2017 text.'}),
  C('conflict-exports-excluded-turnover', {title: '"Export income does not count toward the ₹20 lakh GST limit"', claim: 'Because exports are zero-rated, they are left out of the registration threshold.', correct: 'CGST s.2(6) explicitly includes exports of goods or services in aggregate turnover.', winningRule: ref('rule-gst-registration-services'), why: 'Statute text is explicit.'}),
)

const D = (id, title, dueDate, whatIsDue, extra = {}) => ({_id: id, _type: 'deadline', title, taxYear: ref('ty-2026-27'), dueDate, whatIsDue, rule: ref('rule-advance-tax-2026'), source: ref('src-ita-2025'), ...extra})
docs.push(
  D('dl-2026-adv-1', 'Advance tax - 1st instalment', '2026-06-15', 'At least 15% of estimated tax', {cumulativePercent: 15, appliesTo: ['regular']}),
  D('dl-2026-adv-2', 'Advance tax - 2nd instalment', '2026-09-15', 'At least 45% cumulative', {cumulativePercent: 45, appliesTo: ['regular']}),
  D('dl-2026-adv-3', 'Advance tax - 3rd instalment', '2026-12-15', 'At least 75% cumulative', {cumulativePercent: 75, appliesTo: ['regular']}),
  D('dl-2026-adv-4', 'Advance tax - final instalment', '2027-03-15', '100% of advance tax', {cumulativePercent: 100, appliesTo: ['regular']}),
  D('dl-2026-adv-presumptive', 'Advance tax - presumptive (s.58) filers, single instalment', '2027-03-15', 'Whole advance tax in one go', {cumulativePercent: 100, appliesTo: ['presumptive']}),
)
