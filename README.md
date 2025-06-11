# My Focus App (Screen Overlay)

화면 위에 반투명한 가림막을 띄워 현재 작업에 더 집중할 수 있도록 도와주는 미니멀한 데스크톱 애플리케이션입니다.

---

## ✨ 주요 기능

*   **화면 가리개:** 화면 전체에 반투명한 오버레이를 생성하여 시각적 방해 요소를 줄여줍니다.
*   **자유로운 이동 및 크기 조절:** 창의 아무 곳이나 드래그하여 이동하고, 오른쪽 아래 핸들을 통해 크기를 자유롭게 조절할 수 있습니다.
*   **실시간 투명도 조절:** 하단의 컨트롤 패널을 통해 원하는 투명도를 실시간으로 설정할 수 있습니다.
*   **설정 자동 저장:** 앱을 껐다 켜도 마지막 창 크기, 위치, 투명도 설정이 그대로 유지됩니다.
*   **시스템 트레이 연동:** 창을 닫아도 프로그램이 종료되지 않고 시스템 트레이에 남아있어 편리하게 다시 열 수 있습니다.
*   **전역 단축키:** `Ctrl + Shift + H` 단축키로 언제 어디서든 앱을 즉시 보이거나 숨길 수 있습니다.

---

## 🛠️ 사용 기술

이 프로젝트는 최신 데스크톱 앱 개발 환경을 기반으로 제작되었습니다.

*   **[Electron](https://www.electronjs.org/):** JavaScript, HTML, CSS로 크로스 플랫폼 데스크톱 앱을 만듭니다.
*   **[React](https://reactjs.org/):** 사용자 인터페이스를 구축합니다.
*   **[Vite](https://vitejs.dev/):** 빠르고 효율적인 프론트엔드 개발 및 빌드 환경을 제공합니다.
*   **[pnpm](https://pnpm.io/):** 빠르고 효율적인 패키지 매니저입니다.
*   **[electron-vite](https://electron-vite.org/):** Electron과 Vite를 완벽하게 통합하여 복잡한 설정 없이 개발에만 집중할 수 있도록 합니다.
*   **[electron-store](https://github.com/sindresorhus/electron-store):** 사용자 설정을 간단하게 파일로 저장하고 불러옵니다.
*   **[electron-builder](https://www.electron.build/):** 클릭 몇 번으로 Windows, macOS, Linux용 설치 파일을 생성합니다.

---

## 🚀 시작하기

### 개발 환경에서 실행

1.  이 레포지토리를 클론합니다.
    ```bash
    git clone https://github.com/SangJin983/my-screen-overlay.git
    cd my-focus-app
    ```
2.  의존성을 설치합니다.
    ```bash
    pnpm install
    ```
3.  개발 서버를 시작합니다.
    ```bash
    pnpm dev
    ```

### 빌드 및 설치 파일 생성

Windows용 `.exe` 설치 파일을 생성하려면 아래 명령어를 실행하세요. 빌드가 완료되면 `dist` 폴더 안에 설치 파일이 생성됩니다.

```bash
pnpm run build:win
```
