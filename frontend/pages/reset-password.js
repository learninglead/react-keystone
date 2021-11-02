import { useRouter } from 'next/dist/client/router';

import RequestReset from '../components/RequestReset';
import ResetPassword from '../components/ResetPassword';

export default function ResetPasswordPage() {
  const { query } = useRouter();
  if (!query?.token) {
    return (
      <div>
        <p>You must supply token</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <ResetPassword token={query.token} />
    </div>
  );
}
