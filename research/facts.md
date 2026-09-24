# verified facts (ITA 2025 as amended by FA 2026). extracted first from a studycafe mirror, then re-checked on 25 Sep 2026 against the official incometaxindia PDF (sha256 d54a0ed6a91673d1a4fbcef9b5e472c3efe441139fae38f85a5a0c5b2cfc998b): s.58 Sl.3, s.62(4), s.156, s.202 slabs, s.393(1) Sl.6, s.404, s.408 all match.
official url: https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf (curl blocked, use browser)
- In force 1 Apr 2026 (tax year FY 2026-27 onward). Replaces ITA 1961.
- s.58(2) Table Sl.3: specified profession (s.62(4)) by specified assessee; gross receipts <= 50L, or <= 75L if cash receipts <= 5% of gross receipts; deemed profit 50% of gross receipts or actual, whichever higher. (old 44ADA)
- s.58(2) Table Sl.1: business: turnover <=2cr or <=3cr if cash <=5%; 6% digital / 8% other. (old 44AD)
- s.62(4) specified profession: legal, medical, engineering, architectural, accountancy, technical consultancy, interior decoration, information technology, company secretary; + notified by Board.
- s.202(1) new regime default slabs: 0-4L nil; 4-8L 5%; 8-12L 10%; 12-16L 15%; 16-20L 20%; 20-24L 25%; >24L 30%. Opt-out via s.202(4) (business income: on/before s.263(1) due date).
- s.156(2) rebate (new regime, resident individual): income <= 12L -> 100% of tax or 60,000 whichever less; marginal relief above 12L. s.156(1) old regime: <=5L -> 12,500.
- s.404: advance tax if tax payable >= 10,000.
- s.406? table: 15 Jun 15%, 15 Sep 45%, 15 Dec 75%, 15 Mar 100%. Sub-s(2): assessee declaring under s.58(2) Sl.1 or 3 pays whole advance tax by 15 Mar.
- s.425 interest table: 3% shortfall for first three instalments, 1% last (check).
- s.393(1) Table Sl.6(iii): fees for professional services -> 10% (2% for technical services / call centre); threshold 50,000 (per payer, per year - verify wording). Sl.6(ii): individual/HUF payer not under audit -> 2% above 50 lakh.

# GST (verified from GST Council flyer "Registration under GST Law")
source: https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Registration_under_GST_Law_new.pdf
- threshold: services / mixed -> aggregate turnover 20L (10L in Manipur, Mizoram, Nagaland, Tripura); goods-only 40L (20L in listed special states).
- small suppliers of services below 20/10L exempt from registration even for inter-state supply (Notification 10/2017-Integrated Tax, 13-10-2017). source copy: https://gstcouncil.gov.in/sites/default/files/Agenda/Table%20Agenda%20Note%20No-1.pdf ; third-party mirror (NOT official, not used in dataset): https://gstgyaan.com/pdf/Notification-No-10-2017-Integrated-Tax-dated-13-10-2017.pdf (need official cbic copy)
- TODO: CGST s.2(6) aggregate turnover includes exports; IGST s.2(6) export of services conditions; IGST s.16 zero-rated + LUT (CGST rule 96A); place of supply s.13 IGST.

# GST law (current text from CBIC tax repository)
- CGST s.2(6) aggregate turnover INCLUDES exports of goods or services, all-India per PAN, excl. taxes. (CBIC CGST Act updated copy https://cbic-gst.gov.in/pdf/CGST-Act-Updated-30092020.pdf)
- CGST s.22(1): register if aggregate turnover in FY exceeds 20 lakh (10L special category proviso; 40L goods-only proviso by notification).
- IGST s.2(6) export of services: supplier in India; recipient outside India; place of supply outside India; payment in convertible foreign exchange [or in INR wherever permitted by RBI - inserted by amendment]; not merely establishments of a distinct person. https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_IGST_Act/active/chapteri/section2_v1.00.html
  - CONFLICT: old 2017 copies (e.g. gstcouncil IGST.pdf) show only convertible foreign exchange.
- IGST s.16(3) (substituted by FA 2021, in force 1 Oct 2023 via Notif 27/2023-CT): zero-rated supply WITHOUT payment of IGST under bond/LUT, refund of unutilised ITC. Pay-IGST-and-refund route only for classes notified under s.16(4). https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_IGST_Act/active/chaptervii/section16_v1.00.html
  - CONFLICT: many blogs still describe the pre-Oct-2023 two-option choice (LUT OR pay IGST + refund) as open to everyone.
- LUT: CGST rule 96A, Form GST RFD-11, furnished per financial year. https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter10/rule96a_v1.00.html ; CBIC master circular on LUT https://cbic-gst.gov.in/pdf/Final_Master_circular_LUT_Bond_04102017.pdf
- Circular 78/52/2018-GST (31 Dec 2018) export of services clarifications https://cbic-gst.gov.in/pdf/Circular_78-52-2018_Export_Services.pdf
