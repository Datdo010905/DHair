import { API_BASE_URL } from '@/services/apiClient';
import { endpoints } from '@/services/endpoints';
import type { AuthResponse, AuthUser, ForgotPasswordInput, LoginInput, RegisterInput } from './types';

// Ba API đều gửi JSON và trả về success/message, nên dùng chung phần gửi yêu cầu.
async function sendAuthRequest(
    endpoint: string,
    requestBody: object,
    fallbackMessage: string,
): Promise<AuthResponse> {
    const abortController = new AbortController();

    // Dừng chờ sau 15 giây để nút gửi không bị khóa mãi khi mạng có vấn đề.
    const timeoutId = setTimeout(() => {
        abortController.abort();
    }, 15000);

    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: abortController.signal,
        });

        let responseBody: AuthResponse;
        try {
            responseBody = await response.json();
        } catch {
            throw new Error('Máy chủ trả về dữ liệu không hợp lệ. Vui lòng thử lại.');
        }

        // HTTP thành công chưa đủ; Backend còn phải trả success: true.
        if (!response.ok || responseBody?.success !== true) {
            const errorMessage = responseBody?.message || fallbackMessage;
            throw new Error(errorMessage);
        }
        return responseBody;
    } catch (error) {
        if (abortController.signal.aborted) {
            throw new Error(
                'Máy chủ phản hồi quá lâu. Vui lòng kiểm tra kết quả trước khi gửi lại yêu cầu.',
            );
        }

        if (error instanceof TypeError) {
            throw new Error('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và địa chỉ API.');
        }

        throw error;
    } finally {
        // Luôn dọn bộ đếm thời gian, dù yêu cầu thành công hay thất bại.
        clearTimeout(timeoutId);
    }
}

export async function loginAccount(input: LoginInput): Promise<AuthUser> {
    // Backend dùng số điện thoại làm username. Giữ nguyên mật khẩu đã nhập.
    const requestBody = {
        username: input.phone.trim(),
        pass: input.password,
    };

    const response = await sendAuthRequest(
        endpoints.auth.login,
        requestBody,
        'Đăng nhập thất bại. Vui lòng thử lại.',
    );

    const account = response.data;
    if (!account || typeof account.MATK !== 'string' || !account.MATK.trim()) {
        throw new Error('Máy chủ chưa trả về thông tin tài khoản. Vui lòng thử lại.');
    }

    // Chỉ giữ thông tin hiển thị; không lưu mật khẩu Backend trả về.
    const accountId = account.MATK.trim();
    const fullName = typeof account.HOTEN === 'string' ? account.HOTEN.trim() : '';
    return { accountId, fullName: fullName || accountId };
}

export async function registerAccount(input: RegisterInput): Promise<void> {
    const requestBody = {
        HOTEN: input.fullName.trim(),
        SDT: input.phone.trim(),
        PASS: input.password,
        PHANQUYEN: 0, // Quyền khách hàng theo Backend.
        TRANGTHAI: 'Hoạt động',
        EMAIL: input.email.trim(),
    };

    await sendAuthRequest(
        endpoints.auth.register,
        requestBody,
        'Không thể thực hiện yêu cầu. Vui lòng thử lại.',
    );
}

export async function requestPasswordReset(input: ForgotPasswordInput): Promise<void> {
    // Backend cần cả số điện thoại và email để tìm đúng tài khoản.
    const requestBody = {
        sdt: input.phone.trim(),
        email: input.email.trim(),
    };

    await sendAuthRequest(
        endpoints.auth.forgotPassword,
        requestBody,
        'Không thể thực hiện yêu cầu. Vui lòng thử lại.',
    );
}
