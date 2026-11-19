import { useCallback, useEffect, useRef, useState } from 'react';
import type { Coordinates } from '../types';

export type GeolocationStatus =
  | 'idle'
  /** 권한 요청 또는 위치 확인 중 */
  | 'requesting'
  | 'success'
  /** 사용자가 권한을 거부 */
  | 'denied'
  /** 브라우저가 위치 기능을 지원하지 않음 */
  | 'unavailable'
  /** 시간 초과 등 기타 실패 */
  | 'error';

export interface UseGeolocationResult {
  status: GeolocationStatus;
  coords: Coordinates | undefined;
  /** 위치 권한 요청 (다시 시도할 때도 사용) */
  request: () => void;
}

/**
 * 브라우저 Geolocation 으로 현재 위치 요청
 * - 위치는 메모리(state)에만 두고 저장하지 않음
 */
export function useGeolocation({ auto = true }: { auto?: boolean } = {}): UseGeolocationResult {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [coords, setCoords] = useState<Coordinates>();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }
    setStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mountedRef.current) return;
        setCoords({ x: position.coords.longitude, y: position.coords.latitude });
        setStatus('success');
      },
      (error) => {
        if (!mountedRef.current) return;
        setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'error');
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  }, []);

  useEffect(() => {
    if (auto) request();
  }, [auto, request]);

  return { status, coords, request };
}
