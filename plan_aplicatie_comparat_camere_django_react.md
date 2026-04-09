# Plan gata de implementat în VSCode — aplicație comparat camere + comunitate

## 0. Update de stack frontend

Frontendul va folosi explicit:
- **React**
- **Vite**
- **Material UI (MUI)**

Asta înlocuiește recomandările anterioare bazate pe Tailwind/shadcn. Toată arhitectura de frontend și componentele UI trebuie gândite pentru MUI.

## 1. Obiectiv

Construiești o platformă web de comparat camere foto/video, cu două componente mari:

1. **catalog + comparator tehnic**
2. **comunitate** unde utilizatorii pot:
   - propune corecturi la specificații
   - adăuga review-uri
   - comenta
   - vota utilitatea review-urilor și propunerilor

Stack ales:
- **Backend:** Django + Django REST Framework
- **Frontend:** React + Vite
- **DB:** PostgreSQL
- **Cache / async:** Redis
- **Task queue:** Celery
- **Auth:** JWT / session + social login ulterior
- **Search:** PostgreSQL full text la început, apoi Typesense/Meilisearch
- **Storage imagini:** local în dev, S3/Cloudinary în prod

---

## 2. Structura monorepo recomandată

```txt
camera-hub/
  backend/
    manage.py
    requirements/
    config/
    apps/
      accounts/
      catalog/
      specs/
      comparisons/
      reviews/
      comments/
      contributions/
      moderation/
      imports/
      scoring/
      analytics/
    media/
    static/
    .env
  frontend/
    src/
      app/
      api/
      components/
      features/
      pages/
      hooks/
      lib/
      types/
    public/
    .env
  docs/
    api-contracts/
    db/
    product/
  docker-compose.yml
  .gitignore
  README.md
```

---

## 3. MVP clar

### Funcționalități MVP
- autentificare utilizator
- catalog camere
- pagină individuală cameră
- comparare 2 camere
- filtre și search
- review-uri utilizatori
- comentarii la review-uri
- propuneri de corecturi pentru specificații
- panou minim de moderare admin
- sistem de aprobare / respingere propuneri

### Funcționalități pentru v2
- comparare 3–4 camere
- reputație utilizator
- badge-uri contributors
- watchlist camere
- feed activitate comunitate
- notificări email
- bookmark review-uri
- upload imagini în review

---

## 4. Setup local în VSCode

## 4.1 Backend

### Creezi environment
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements/dev.txt
```

### Pachete backend
```txt
Django
 djangorestframework
 django-cors-headers
 django-filter
 psycopg[binary]
 celery
 redis
 pillow
 drf-spectacular
 django-environ
 djangorestframework-simplejwt
 django-ckeditor sau tiptap-ready alternative dacă vrei rich text ulterior
```

## 4.2 Frontend
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom @tanstack/react-query axios zod react-hook-form
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-data-grid
npm install @mui/lab
```

### UI recomandat
- **Material UI (MUI)**
- MUI theme customizat pentru brand
- DataGrid pentru tabele administrative și moderare
- componente MUI pentru forms, dialogs, tabs, cards, chips, pagination

---

## 5. Modele Django — gata de implementat

## 5.1 accounts

### CustomUser
- id
- email
- username
- display_name
- avatar
- bio
- role (`user`, `moderator`, `admin`)
- reputation_score
- created_at
- updated_at

### UserProfile
- user
- country
- website
- youtube_channel
- favorite_brands
- review_count_cache
- contribution_count_cache

---

## 5.2 catalog

### Brand
- id
- name
- slug
- country
- official_website
- logo

### Camera
- id
- brand (FK)
- model_name
- full_name
- slug
- category (`mirrorless`, `dslr`, `compact`, `cinema`, `action`)
- mount
- announcement_date
- release_date
- status (`active`, `discontinued`, `rumored`)
- msrp
- current_price_estimate
- short_summary
- hero_image
- official_url
- is_published
- created_at
- updated_at

### CameraAlias
- id
- camera
- alias
- region

### CameraGalleryImage
- id
- camera
- image
- alt_text
- order

---

## 5.3 specs

### SensorSpec
- camera (OneToOne)
- sensor_type
- sensor_format
- sensor_width_mm
- sensor_height_mm
- effective_mp
- max_photo_resolution
- native_iso_min
- native_iso_max
- extended_iso_min
- extended_iso_max
- ibis

### VideoSpec
- camera (OneToOne)
- max_video_resolution
- max_4k_fps
- max_fhd_fps
- raw_video
- internal_10bit
- log_profiles
- recording_limit_min
- overheating_notes
- mic_in
- headphone_out
- hdmi_type
- usb_streaming

### BodySpec
- camera (OneToOne)
- weight_g
- width_mm
- height_mm
- depth_mm
- weather_sealed
- battery_shots_cipa
- articulating_screen
- touchscreen
- evf
- evf_resolution
- dual_card_slots

### AutofocusSpec
- camera (OneToOne)
- phase_detect
- af_points
- eye_af_human
- eye_af_animal
- subject_tracking
- burst_fps_mech
- burst_fps_electronic

### ConnectivitySpec
- camera (OneToOne)
- wifi
- bluetooth
- usb_c
- usb_charging
- webcam_mode

### SpecFieldSource
- id
- camera
- section
- field_name
- source_name
- source_url
- imported_at
- confidence_score
- is_verified

---

## 5.4 reviews

### Review
- id
- camera
- author
- title
- body
- rating_overall (1–10)
- rating_photo (1–10)
- rating_video (1–10)
- rating_value (1–10)
- usage_type (`travel`, `wedding`, `studio`, `wildlife`, `vlogging`, `cinema`, `general`)
- experience_level (`beginner`, `enthusiast`, `pro`)
- ownership_status (`owned`, `tested`, `rented`)
- pros
- cons
- is_verified_owner (opțional ulterior)
- is_published
- is_featured
- helpful_votes_count
- created_at
- updated_at

### ReviewVote
- review
- user
- value (`helpful`)
- unique(review, user)

---

## 5.5 comments

### Comment
- id
- user
- content_type (`review`, `camera`, `proposal`)
- object_id
- body
- parent (self FK, nullable)
- is_published
- created_at
- updated_at

### CommentVote
- comment
- user
- value (`up`, `down`)
- unique(comment, user)

---

## 5.6 contributions

### CameraEditProposal
- id
- camera
- proposer
- section
- field_name
- current_value
- proposed_value
- reason
- evidence_url
- status (`pending`, `approved`, `rejected`, `needs_info`)
- moderator_notes
- created_at
- reviewed_at
- reviewed_by

### CameraBulkProposal
- id
- camera
- proposer
- payload_json
- reason
- status
- moderator_notes
- created_at
- reviewed_at
- reviewed_by

### ContributionLog
- id
- user
- camera
- type (`edit_proposal`, `review`, `comment`, `data_import_fix`)
- points_awarded
- created_at

---

## 5.7 moderation

### ModerationAction
- id
- moderator
- target_type
- target_id
- action (`approve`, `reject`, `hide`, `ban`, `warn`, `feature`)
- reason
- created_at

### Report
- id
- reporter
- target_type
- target_id
- reason_type (`spam`, `abuse`, `incorrect`, `duplicate`, `other`)
- details
- status (`open`, `closed`, `dismissed`)
- created_at
- resolved_at
- resolved_by

---

## 5.8 comparisons

### ComparisonSnapshot
- id
- left_camera
- right_camera
- slug
- summary_json
- created_at

### ComparisonViewLog
- left_camera
- right_camera
- viewed_at
- user nullable

---

## 6. Fluxuri principale

## 6.1 Flux utilizator normal
1. caută o cameră
2. vede specificațiile
3. compară cu alt model
4. citește review-uri
5. lasă review sau comentariu
6. observă o greșeală
7. trimite propunere de modificare

## 6.2 Flux moderator
1. intră în queue de propuneri
2. vede diferența dintre valoarea curentă și cea propusă
3. verifică dovada/linkul
4. aprobă sau respinge
5. la aprobare se aplică automat modificarea pe model
6. se loghează acțiunea și se acordă puncte utilizatorului

## 6.3 Flux import automat
1. rulează task Celery
2. aduce date din surse externe
3. normalizează și detectează schimbări
4. dacă valoarea diferă, creează sugestie internă sau update direct pentru câmpuri low-risk
5. marchează sursa și confidence

---

## 7. API DRF — listă de endpointuri

## Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

## Catalog
- `GET /api/brands/`
- `GET /api/cameras/`
- `GET /api/cameras/{slug}/`
- `GET /api/cameras/{slug}/similar/`
- `GET /api/cameras/{slug}/reviews/`
- `GET /api/cameras/{slug}/comments/`

## Compare
- `GET /api/compare/?left=sony-a7-iv&right=canon-r6-mark-ii`

## Reviews
- `POST /api/reviews/`
- `PATCH /api/reviews/{id}/`
- `DELETE /api/reviews/{id}/`
- `POST /api/reviews/{id}/vote/`
- `POST /api/reviews/{id}/report/`

## Comments
- `POST /api/comments/`
- `PATCH /api/comments/{id}/`
- `DELETE /api/comments/{id}/`
- `POST /api/comments/{id}/vote/`
- `POST /api/comments/{id}/report/`

## Contributions
- `POST /api/cameras/{id}/proposals/field-edit/`
- `POST /api/cameras/{id}/proposals/bulk-edit/`
- `GET /api/my/proposals/`
- `GET /api/proposals/{id}/`

## Moderation
- `GET /api/moderation/proposals/`
- `POST /api/moderation/proposals/{id}/approve/`
- `POST /api/moderation/proposals/{id}/reject/`
- `GET /api/moderation/reports/`

## Profile / community
- `GET /api/users/{username}/`
- `GET /api/users/{username}/reviews/`
- `GET /api/users/{username}/contributions/`

---

## 8. React app structure

```txt
src/
  app/
    router.tsx
    providers.tsx
    theme.ts
  api/
    client.ts
    auth.ts
    cameras.ts
    reviews.ts
    comments.ts
    proposals.ts
  components/
    layout/
    common/
    mui/
  features/
    auth/
    camera-catalog/
    camera-detail/
    compare/
    reviews/
    comments/
    contributions/
    moderation/
    profile/
  pages/
    HomePage.tsx
    CameraListPage.tsx
    CameraDetailPage.tsx
    ComparePage.tsx
    LoginPage.tsx
    RegisterPage.tsx
    UserProfilePage.tsx
    ModerationPage.tsx
  hooks/
  lib/
    utils.ts
    format.ts
  types/
    api.ts
  main.tsx
```

### Fișiere frontend obligatorii de la început
- `src/app/providers.tsx` pentru QueryClientProvider, RouterProvider, ThemeProvider
- `src/app/theme.ts` pentru tema MUI
- `src/api/client.ts` pentru axios client cu interceptori JWT
- `src/components/layout/AppShell.tsx` pentru layout principal

---

## 9. Pagini frontend

### Home
- search mare
- comparații populare
- camere noi
- review-uri recente
- contributors top

### Catalog
- filters sidebar
- cards rezultate
- quick compare checkbox

### Camera detail
- overview
- scoruri
- specs tabs
- review-uri
- comentarii
- buton „propune corectură”

### Compare page
- summary winner pe categorii
- tabel specs
- highlight diferențe
- buton „arată doar diferențele”

### Community profile
- review-uri scrise
- propuneri trimise
- status aprobare
- reputație

### Moderation dashboard
- pending proposals
- pending reports
- review queue

---

## 10. Componente React importante

- `AppShell`
- `TopNav`
- `FilterSidebar`
- `CameraCard`
- `CameraSpecsTable`
- `CompareTable`
- `CompareSummary`
- `ReviewCard`
- `ReviewFormDialog`
- `CommentThread`
- `ProposalDialog`
- `ProposalDiffCard`
- `ModerationQueueTable`
- `UserBadge`
- `ReputationChip`

### Mapping pe Material UI
- cards: `Card`, `CardContent`, `CardHeader`
- layout: `Container`, `Grid`, `Stack`, `Box`
- tabele compare/admin: `Table` + `TableContainer`, iar pentru admin `DataGrid`
- dialoguri: `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`
- filtre: `Drawer`, `Accordion`, `Checkbox`, `Slider`, `Select`, `Autocomplete`
- feedback: `Snackbar`, `Alert`, `Chip`, `Tooltip`
- navigație: `Tabs`, `Breadcrumbs`, `Pagination`

---

## 11. Reguli de business

### Review-uri
- un utilizator poate avea max 1 review per cameră în MVP
- review-ul trebuie să aibă minimum 200 caractere
- pros/cons obligatorii
- voturile helpful pot fi doar pozitive în MVP

### Propuneri de editare
- utilizatorul nu modifică direct datele live
- trimite propunere
- propunerea trebuie să includă motiv
- pentru câmpuri sensibile, cere și evidence URL
- la aprobare: datele se actualizează și se creează audit trail

### Comentarii
- suport reply nested 1 nivel în MVP
- moderare manuală + filtrare basic spam

### Reputație
- review aprobat/publicat: +10
- propunere aprobată: +15
- comentariu util votat: +2
- raport valid: +5
- propunere respinsă repetitiv/spam: penalizare

---

## 12. Sistemul de propuneri — implementare recomandată

Nu lăsa utilizatorii să editeze direct tabelul `Camera` sau `*Spec`.

### Varianta bună
- FE deschide formular cu valoarea curentă
- user trimite valoarea nouă
- BE creează `CameraEditProposal`
- moderator aprobă
- service layer aplică modificarea în modelul corect

### Service layer
Fișier recomandat:
```txt
backend/apps/contributions/services/proposal_apply.py
```

Responsabilități:
- validează field-ul
- convertește tipul corect
- aplică update în modelul țintă
- loghează provenance și moderation action
- acordă puncte

---

## 13. Import automat de camere

## Surse recomandate
- seed dataset-uri publice
- Wikidata pentru bază
- enrichment din pagini oficiale
- fallback import CSV din admin

## Apps și fișiere
```txt
backend/apps/imports/
  clients/
    wikidata_client.py
    official_specs_client.py
  parsers/
    normalizers.py
    field_mappers.py
  tasks.py
  services/
    import_cameras.py
    merge_camera_data.py
```

## Flux import
1. aduce lista modelelor
2. face upsert `Camera`
3. completează tabelele spec
4. salvează provenance
5. marchează câmpuri neverificate
6. trimite în admin camerele cu date incomplete

---

## 14. Search și filtrare

## MVP
Folosești Django filters + indexuri PostgreSQL.

Filtre:
- brand
- category
- sensor_format
- price range
- release year
- ibis
- 4k60
- weather sealing
- weight

## V2
Adaugi Typesense / Meilisearch pentru:
- autocomplete rapid
- typo tolerance
- ranking bun

---

## 15. Compare engine

Fișier backend recomandat:
```txt
backend/apps/comparisons/services/compare_cameras.py
```

Output:
- `overview`
- `winner_by_section`
- `field_diffs`
- `summary_text`

Exemplu structură:
```json
{
  "overview": {
    "left": "Sony A7 IV",
    "right": "Canon R6 Mark II"
  },
  "winner_by_section": {
    "video": "right",
    "portability": "left"
  },
  "field_diffs": [
    {
      "section": "video",
      "label": "4K FPS",
      "left": "30",
      "right": "60",
      "winner": "right"
    }
  ]
}
```

---

## 16. Moderare și siguranță

### Minim necesar
- rate limit pe review/comment/proposal
- anti-spam simplu
- report abuse
- blocare conținut nepublicat până la moderare, dacă vrei control mai strict

### Recomandare MVP
- review-urile publice direct, dar raportabile
- propunerile de editare numai după aprobare
- comentariile publice direct, dar ascunse dacă sunt raportate de mai multe ori

---

## 17. Permisiuni

### Roluri
- guest
- authenticated user
- moderator
- admin

### Exemples
- guest: citește catalog, review-uri, comparații
- user: review, comentariu, propunere edit
- moderator: aprobă propuneri, ascunde conținut, gestionează reports
- admin: full access + importuri + configurări

---

## 18. Testare

## Backend
- pytest sau Django TestCase
- teste pentru:
  - compare service
  - proposal approval flow
  - review permissions
  - moderation endpoints
  - serializer validation

## Frontend
- Vitest + React Testing Library
- teste pentru:
  - forms
  - compare table
  - proposal modal
  - review submission

## E2E
- Playwright
- flow:
  - login
  - add review
  - submit proposal
  - moderator approve

---

## 19. Roadmap implementare în 8 săptămâni

## Săptămâna 1
- setup repo
- Django config
- React config
- Postgres + Redis docker
- auth de bază

## Săptămâna 2
- modele catalog + specs
- admin Django pentru camere
- seed de date inițial

## Săptămâna 3
- API list/detail camere
- frontend catalog + camera detail
- search + filters

## Săptămâna 4
- compare engine backend
- compare page frontend
- summary și diff highlighting

## Săptămâna 5
- review-uri: modele, API, UI
- helpful votes
- user profile basic

## Săptămâna 6
- comentarii threadate
- report system
- pagină profil contributor

## Săptămâna 7
- propuneri de editare
- dashboard de moderare
- approve/reject flow
- reputation system

## Săptămâna 8
- import automat v1
- QA
- testare e2e
- polish UI
- deploy staging

---

## 20. Task list concret pentru VSCode

## Backend tasks
- [ ] creează proiect Django și apps
- [ ] configurează settings split dev/prod
- [ ] configurează DRF, CORS, JWT
- [ ] creează CustomUser
- [ ] implementează modelele Brand / Camera / Specs
- [ ] adaugă admin custom pentru Camera
- [ ] creează serializers și viewsets pentru catalog
- [ ] implementează compare service
- [ ] creează modelele Review / Comment / Proposal
- [ ] implementează moderation endpoints
- [ ] adaugă Celery + Redis
- [ ] implementează import task v1

## Frontend tasks
- [ ] setup Vite + React + TypeScript
- [ ] configurează MUI ThemeProvider
- [ ] configurează React Query și axios client
- [ ] setup router și layout principal
- [ ] creează componente comune MUI
- [ ] catalog page
- [ ] camera detail page
- [ ] compare page
- [ ] review list + dialog formular
- [ ] comments thread
- [ ] proposal dialog
- [ ] user profile page
- [ ] moderation page cu DataGrid

## 21. Structură de fișiere gata de creat în VSCode

### Backend
```txt
backend/
  manage.py
  .env
  requirements/
    base.txt
    dev.txt
  config/
    __init__.py
    settings/
      __init__.py
      base.py
      dev.py
      prod.py
    urls.py
    asgi.py
    wsgi.py
    celery.py
  apps/
    accounts/
      __init__.py
      apps.py
      models.py
      admin.py
      serializers.py
      views.py
      urls.py
    catalog/
      __init__.py
      apps.py
      models.py
      admin.py
      serializers.py
      views.py
      urls.py
      selectors.py
    specs/
      __init__.py
      apps.py
      models.py
      admin.py
      serializers.py
    comparisons/
      __init__.py
      apps.py
      views.py
      serializers.py
      services/
        compare_cameras.py
    reviews/
      __init__.py
      apps.py
      models.py
      serializers.py
      views.py
      permissions.py
    comments/
      __init__.py
      apps.py
      models.py
      serializers.py
      views.py
    contributions/
      __init__.py
      apps.py
      models.py
      serializers.py
      views.py
      services/
        proposal_apply.py
    moderation/
      __init__.py
      apps.py
      models.py
      serializers.py
      views.py
    imports/
      __init__.py
      apps.py
      tasks.py
      clients/
        wikidata_client.py
      services/
        import_cameras.py
        merge_camera_data.py
    scoring/
      __init__.py
      apps.py
      services/
        camera_scores.py
```

### Frontend
```txt
frontend/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  .env
  src/
    main.tsx
    app/
      providers.tsx
      router.tsx
      theme.ts
    api/
      client.ts
      auth.ts
      cameras.ts
      reviews.ts
      comments.ts
      proposals.ts
    components/
      layout/
        AppShell.tsx
        TopNav.tsx
        Footer.tsx
      common/
        LoadingState.tsx
        EmptyState.tsx
        ErrorState.tsx
        SectionHeader.tsx
      mui/
        AppTextField.tsx
        AppSelect.tsx
        ConfirmDialog.tsx
    features/
      camera-catalog/
        components/
          CameraCard.tsx
          FilterSidebar.tsx
        hooks/
          useCameraFilters.ts
      camera-detail/
        components/
          CameraHeader.tsx
          CameraSpecsTabs.tsx
      compare/
        components/
          CompareSummary.tsx
          CompareTable.tsx
      reviews/
        components/
          ReviewCard.tsx
          ReviewFormDialog.tsx
      comments/
        components/
          CommentThread.tsx
          CommentForm.tsx
      contributions/
        components/
          ProposalDialog.tsx
          ProposalDiffCard.tsx
      moderation/
        components/
          ModerationQueueTable.tsx
      profile/
        components/
          ProfileHeader.tsx
          ContributionList.tsx
    pages/
      HomePage.tsx
      CameraListPage.tsx
      CameraDetailPage.tsx
      ComparePage.tsx
      LoginPage.tsx
      RegisterPage.tsx
      UserProfilePage.tsx
      ModerationPage.tsx
    types/
      api.ts
    lib/
      utils.ts
      format.ts
```

## 22. Deploy recomandat

### Backend
- Render / Railway / Fly.io / VPS
- PostgreSQL managed
- Redis managed

### Frontend
- Vercel / Netlify

### Media
- S3 / Cloudinary

### Observability
- Sentry
- simple analytics

---

## 22. Ce să faci prima dată, concret

Ordinea ideală:

1. scaffolding repo
2. setup Django + DRF + React + Vite + MUI
3. modele catalog/specs
4. admin camere
5. API + catalog UI
6. compare
7. reviews/comments
8. proposals/moderation
9. import automat
10. reputație și polish

## 23. Blueprint inițial de cod — ordine de implementare în fișiere

### Backend, în ordine
1. `config/settings/base.py`
2. `apps/accounts/models.py`
3. `apps/catalog/models.py`
4. `apps/specs/models.py`
5. `apps/catalog/serializers.py`
6. `apps/catalog/views.py`
7. `apps/comparisons/services/compare_cameras.py`
8. `apps/reviews/models.py`
9. `apps/comments/models.py`
10. `apps/contributions/models.py`
11. `apps/contributions/services/proposal_apply.py`

### Frontend, în ordine
1. `src/app/theme.ts`
2. `src/app/providers.tsx`
3. `src/api/client.ts`
4. `src/app/router.tsx`
5. `src/components/layout/AppShell.tsx`
6. `src/pages/CameraListPage.tsx`
7. `src/pages/CameraDetailPage.tsx`
8. `src/pages/ComparePage.tsx`
9. `src/features/reviews/components/ReviewFormDialog.tsx`
10. `src/features/contributions/components/ProposalDialog.tsx`

## 24. Recomandare tehnică finală

Pentru MVP, ține totul simplu:
- monorepo
- Django REST API separat
- React fără SSR la început
- PostgreSQL ca sursă unică de adevăr
- user-generated content moderat
- edit proposals în loc de edit direct

Asta îți oferă:
- bază solidă
- extindere ușoară
- risc mic pe integritatea datelor
- comunitate utilă fără să pierzi controlul asupra catalogului

---

## 24. Următorul pas ideal

După acest plan, următoarele documente tehnice de produs ar trebui create imediat:

1. schema DB completă
2. contractele API request/response
3. backlog pe epics și tickets
4. arhitectura frontend pe componente
5. checklist de setup pentru VSCode

## 25. Ce urmează în continuarea implementării

Acum următorul output ar trebui să fie unul din aceste 3 lucruri:

1. **scheletul backend Django** cu fișiere și cod starter
2. **scheletul frontend React + Vite + MUI** cu routing, theme și layout
3. **contractele API complete** pentru toate endpointurile MVP

Ordinea recomandată este:
- mai întâi backend skeleton
- apoi frontend skeleton
- apoi API contracts complete

