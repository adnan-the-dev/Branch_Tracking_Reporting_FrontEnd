import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle2, XCircle, KeyRound } from 'lucide-react';
import api from '../api/client';

export default function Settings() {
  const [config, setConfig] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMessage, setPwMessage] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setConfig(data));
  }, []);

  const testEmail = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const { data } = await api.get('/settings/email-test');
      setTestResult({ ok: true, message: data.message });
    } catch (err) {
      setTestResult({ ok: false, message: err.response?.data?.error || 'Connection failed' });
    } finally {
      setTesting(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwMessage(null);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setPwMessage({ ok: true, text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPwMessage({ ok: false, text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Email configuration and account security</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-brand-500" />
          <h2 className="font-semibold text-ink-900">Email (Outlook / Office365)</h2>
        </div>
        {config && (
          <div className="text-sm space-y-1 text-slate-600">
            <p>
              SMTP Host: <span className="font-medium text-ink-800">{config.smtpHost}</span>
            </p>
            <p>
              SMTP User: <span className="font-medium text-ink-800">{config.smtpUser || 'Not set'}</span>
            </p>
            <p>
              Default Recipients:{' '}
              <span className="font-medium text-ink-800">
                {config.reportRecipients.length ? config.reportRecipients.join(', ') : 'None set'}
              </span>
            </p>
            <p>
              Auto-send Daily Report:{' '}
              <span className="font-medium text-ink-800">
                {config.dailyAutosend ? `Enabled (${config.dailyCron})` : 'Disabled'}
              </span>
            </p>
          </div>
        )}
        <p className="text-xs text-slate-400">
          These values come from the backend <code>.env</code> file. Update <code>SMTP_USER</code>,{' '}
          <code>SMTP_PASS</code> and <code>REPORT_RECIPIENTS</code> there, then restart the server.
        </p>
        <button
          onClick={testEmail}
          disabled={testing}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60"
        >
          {testing ? 'Testing...' : 'Test SMTP Connection'}
        </button>
        {testResult && (
          <div
            className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
              testResult.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {testResult.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {testResult.message}
          </div>
        )}
      </div>

      <form onSubmit={changePassword} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-brand-500" />
          <h2 className="font-semibold text-ink-900">Change Password</h2>
        </div>
        {pwMessage && (
          <div
            className={`text-sm px-4 py-3 rounded-xl ${
              pwMessage.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {pwMessage.text}
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={pwLoading}
          className="bg-ink-900 hover:bg-ink-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60"
        >
          {pwLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
