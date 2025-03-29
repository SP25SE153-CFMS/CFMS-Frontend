export default function useParams(): Record<string, string> {
    if (typeof window === 'undefined') {
        return {};
    }

    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};

    params.forEach((value, key) => {
        result[key] = value;
    });

    return result;
}
