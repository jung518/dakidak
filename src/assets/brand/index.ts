/**
 * 브랜드 이미지 자동 감지
 * - 아래 경로에 파일을 넣기만 하면 Logo / Mascot 컴포넌트가 이모지 대신 이미지를 보여줍니다.
 *   src/assets/brand/logo.svg
 *   src/assets/brand/character.png
 * - import.meta.glob 은 실제 존재하는 파일만 가져오므로 파일이 없어도 빌드 오류가 나지 않습니다.
 */
const files = import.meta.glob<string>('./*.{svg,png}', { eager: true, import: 'default' });

export const logoSrc: string | undefined = files['./logo.svg'];
export const characterSrc: string | undefined = files['./character.png'];
