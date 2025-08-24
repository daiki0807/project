import { ABCAnalysisData, Student } from './types';

export const FORM_STEPS: { id: keyof ABCAnalysisData; title: string; placeholder: string }[] = [
  { id: 'antecedent', title: 'A: 事前の状況 (Antecedent)', placeholder: '問題行動が起こる直前の状況を具体的に記述してください。\n例：国語の授業中、漢字の書き取り練習が始まった時…' },
  { id: 'behavior', title: 'B: 行動 (Behavior)', placeholder: '観察された問題行動を具体的に、客観的に記述してください。\n例：突然立ち上がって教室の後ろに走り出した…' },
  { id: 'consequence', title: 'C: 結果 (Consequence)', placeholder: '行動の直後に起こったことを記述してください。\n例：先生が「席に戻りなさい」と注意した…' },
  { id: 'desiredBehavior', title: '望ましい代替行動', placeholder: '問題行動の代わりに、どのような行動をとってほしかったかを記述してください。\n例：分からないことがあれば、静かに手を挙げて先生に質問する。' },
  { id: 'praiseMethod', title: '効果的な褒め方', placeholder: 'どのような褒め方をすれば、その子のモチベーションが上がりますか？\n例：結果だけでなく、努力の過程を具体的に褒める。「難しい漢字に挑戦して偉いね！」' },
  { id: 'enjoyableActivity', title: '好きなこと・楽しみな活動', placeholder: 'その子が好きなことや、ご褒美として効果的な活動を記述してください。\n例：好きなキャラクターのシール、5分間の自由時間' },
  { id: 'responseStrategy', title: '問題行動への対応策', placeholder: '今後、同様の問題行動が起きた際に、どのように対応する計画ですか？\n例：まずはクールダウンを促し、落ち着いてから理由を聞く。' },
];

export const getPrompt = (student: Pick<Student, 'name' | 'grade'>, analysisData: ABCAnalysisData): string => {
  return `
あなたは児童教育、特に特別支援教育に深い知見を持つ専門家です。以下のABC分析データと指導方針に基づき、事前の状況（A: Antecedent）において、問題行動（B: Behavior）を未然に防ぐための工夫について、具体的で実践的なアドバイスを提案してください。

# 児童情報
- 名前: ${student.name}
- 学年: ${student.grade || '未設定'}

# ABC分析
- **A（事前の状況）**: ${analysisData.antecedent}
- **B（問題行動）**: ${analysisData.behavior}
- **C（結果）**: ${analysisData.consequence}

# 指導方針
- **望ましい代替行動**: ${analysisData.desiredBehavior}
- **効果的な褒め方**: ${analysisData.praiseMethod}
- **好きなこと・楽しみな活動**: ${analysisData.enjoyableActivity}
- **問題行動への対応策**: ${analysisData.responseStrategy}

# 指示
以下の観点から、**事前の状況（A）に対する予防的な工夫**を、具体的で、教育現場ですぐに実践できる形で3〜5個提案してください。

回答は**Markdown形式**で、以下の構成に従ってください。
- 導入として、全体的な視点や励ましの言葉を記述します。
- 各提案は \`###\` (H3見出し) を使ってタイトルを付けます。
- 提案の詳細は、箇条書き (\`*\` や \`-\`) や段落で説明します。
- 強調したい部分は \`**太字**\` を使用してください。

回答は、常に肯定的で、教師を勇気づけるような口調でお願いします。
  `;
};