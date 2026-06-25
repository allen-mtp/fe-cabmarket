/**
 * Logic chia tiền dùng chung cho form (xem trước) và bảng lịch sử.
 *
 * Quy tắc:
 *  - Tổng tiền chia đều cho những người ĐÃ ĐI (participants). Người không đi
 *    không bị tính.
 *  - Chia số nguyên: phần dư (do làm tròn) được rải +1 cho những người đầu
 *    danh sách để tổng các phần đúng bằng tổng tiền (không lệch 1 đồng).
 *  - Người trả (payer) đã ứng toàn bộ tiền, nên những người còn lại "nợ" payer
 *    đúng phần của mình.
 */
export interface MemberShare {
  name: string;
  amount: number;
  isPayer: boolean;
}

export interface SplitResult {
  /** Số người được chia. */
  count: number;
  /** Mỗi người trung bình (làm tròn) — dùng để hiển thị nhanh. */
  perPerson: number;
  /** Chi tiết từng người (đã rải phần dư). */
  shares: MemberShare[];
  /** Tổng số tiền người khác phải trả lại cho payer. */
  owedToPayer: number;
}

export function computeSplit(
  amount: number,
  participants: string[],
  payer: string,
): SplitResult {
  const people = participants.filter((p) => p && p.trim());
  const count = people.length;

  if (count === 0 || amount <= 0) {
    return { count, perPerson: 0, shares: [], owedToPayer: 0 };
  }

  const base = Math.floor(amount / count);
  let remainder = amount - base * count; // 0..count-1

  const shares: MemberShare[] = people.map((name) => {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    return {
      name,
      amount: base + extra,
      isPayer: name === payer,
    };
  });

  const owedToPayer = shares
    .filter((s) => !s.isPayer)
    .reduce((sum, s) => sum + s.amount, 0);

  return {
    count,
    perPerson: Math.round(amount / count),
    shares,
    owedToPayer,
  };
}
