# Protótipo de Raciocínio Baseado em Casos (RBC) — **Risco de Diabetes**

> **Objetivo**  
> Criar um protótipo de RBC que receba um novo paciente, compare-o a uma base de pelo menos 50 casos históricos e mostre os casos mais parecidos, permitindo que o usuário ajuste a importância (peso) de cada atributo.

Projeto publicado via **GitHub Pages**.

---

## 1. Como o cálculo de similaridade funciona

1. **Similaridade por atributo**  
   * **Numéricos** – quanto menor a diferença entre os valores do paciente e do caso histórico, mais pontos. A diferença é dividida pelo intervalo real do atributo na base (por exemplo, Idade de 20 a 69 anos) para obter sempre um resultado entre 0 e 1.  
   * **Categóricos ou binários** – recebem 1 se os dois valores forem iguais (ambos “Male”, por exemplo) ou 0 se forem diferentes.

2. **Aplicação de pesos**  
   Cada atributo tem um peso-padrão (0 a 1) que representa sua importância clínica. Esses pesos podem ser alterados na interface antes de calcular.

3. **Pontuação global**  
   A pontuação final de um caso é a soma das notas locais multiplicadas pelos respectivos pesos e depois dividida pelo total de pesos. O resultado fica entre 0 % e 100 % e é exibido como “% de similaridade”.

4. **Ordenação**  
   Todos os casos da base são pontuados e exibidos do mais para o menos parecido.

---

## 2. Atributos, domínio observado e pesos-padrão

| # | Atributo                      | Tipo       | `dataset.csv` | Peso | Principal motivo clínico* |
|---|------------------------------|-----------|--------------------------|------|---------------------------|
| 1 | Age | Numérico | 20–69 anos | **0.07** | Risco maior após 35 anos [1] |
| 2 | Sex | Categórico | Female, Male | 0.03 | Diferenças hormonais |
| 3 | Ethnicity | Categórico | Black, Asian, White, Hispanic | 0.05 | Variação de risco por etnia [1] |
| 4 | BMI | Numérico | 18.5–40.0 kg/m² | **0.08** | Obesidade é fator crítico [2] |
| 5 | Waist Circumference | Numérico | 70–120 cm | 0.08 | Gordura visceral [3] |
| 6 | Fasting Blood Glucose | Numérico | 70–200 mg/dL | **0.10** | Critério diagnóstico [4] |
| 7 | HbA1c | Numérico | 4.0–15 % | 0.10 | Média dos níveis de glicose no sangue dos últimos ~3 meses. [5] |
| 8 | Blood Pressure Systolic | Numérico | 90–179 mmHg | 0.05 | Hipertensão associada [6] |
| 9 | Blood Pressure Diastolic | Numérico | 60–119 mmHg | 0.05 | Hipertensão associada [6] |
|10 | Cholesterol Total | Numérico | 150–300 mg/dL | 0.04 | Dislipidemia [6] |
|11 | Cholesterol HDL | Numérico | 30–80 mg/dL | 0.04 | HDL baixo aumenta risco |
|12 | Cholesterol LDL | Numérico | 70–200 mg/dL | 0.04 | Níveis elevados de colesterol LDL estão fortemente associados a complicações vasculares |
|13 | GGT | Numérico | 10–100 U/L | 0.03 | Estresse oxidativo [7] |
|14 | Serum Urate | Numérico | 3.0–8.0 mg/dL | 0.03 | Hiperuricemia e DM2 [8] |
|15 | Physical Activity Level | Categórico | Low, Moderate, High | 0.04 | Sedentarismo [9] |
|16 | Dietary Intake Calories | Numérico | 1500–3999 kcal | 0.04 | Superávit calórico [2] |
|17 | Alcohol Consumption | Categórico | None, Moderate, Heavy | 0.03 | Prejuízo ao controle |
|18 | Smoking Status | Categórico | Never, Former, Current | 0.03 | Tabagismo amplia resistência [6] |
|19 | Family History Diabetes | Binário | 0 / 1 | **0.05** | Risco hereditário [1] |
|20 | Previous Gestational Diabetes | Binário | 0 / 1 | 0.05 | 50 % evoluem para DM2 [1] |

\* Fontes completas no final do arquivo.

---

## 3. Fluxo de uso da aplicação

1. **Inserir dados do novo paciente** – Preenchimento de 20 campos com valores sugeridos.  
2. **Ajustar pesos** – Cada peso varia de 0 a 1; os valores padrão vêm da tabela acima.  
3. **Clique em “Calcular Similaridade”** – A interface exibe todos os casos ordenados e o percentual de similaridade.

---

## 4. Estrutura do repositório

| Arquivo / pasta | Descrição |
|-----------------|-----------|
| `index.html`, `styles.css`, `script.js` | Interface e lógica do protótipo |
| `casos.csv` | Base de casos de teste |
| `README.md` | Documentação |

---

## 5. Referências

[1]: https://en.wikipedia.org/wiki/Type_2_diabetes "Type 2 diabetes"  
[2]: https://www.verywellhealth.com/american-diabetes-association-bmi-weight-management-8551864 "The American Diabetes Association Is Reevaluating BMI for Weight Management"  
[3]: https://www.sciencedirect.com/science/article/pii/S2666970624000350 "Anthropometric measures of obesity as risk indicators for ..."  
[4]: https://www.nature.com/articles/s41591-023-02610-2 "Global variation in diabetes diagnosis and prevalence based on ..."  
[5]: https://www.nature.com/articles/s41598-025-89374-6 "Association between glycated hemoglobin A1c levels, control status ..."  
[6]: https://diabetesjournals.org/care/article/47/Supplement_1/S179/153957/10-Cardiovascular-Disease-and-Risk-Management "10. Cardiovascular Disease and Risk Management: Standards of ..."  
[7]: https://ijdo.ssu.ac.ir/article-1-835-en.pdf "[PDF] Gamma-Glutamyl Transferase and the Risk of Type 2 Diabetes ..."  
[8]: https://pmc.ncbi.nlm.nih.gov/articles/PMC2732137/ "Association Between Serum Uric Acid and Development of Type 2 ..."  
[9]: https://diabetesjournals.org/care/article/48/Supplement_1/S86/157563/5-Facilitating-Positive-Health-Behaviors-and-Well "5. Facilitating Positive Health Behaviors and Well-being to Improve ..."

1. https://en.wikipedia.org/wiki/Type_2_diabetes <br />
2. https://www.verywellhealth.com/american-diabetes-association-bmi-weight-management-8551864 <br />
3. https://www.sciencedirect.com/science/article/pii/S2666970624000350 <br />
4. https://www.nature.com/articles/s41591-023-02610-2 <br />
5. https://www.nature.com/articles/s41598-025-89374-6 <br />
6. https://diabetesjournals.org/care/article/47/Supplement_1/S179/153957/10-Cardiovascular-Disease-and-Risk-Management <br />
7. https://ijdo.ssu.ac.ir/article-1-835-en.pdf <br />
8. https://pmc.ncbi.nlm.nih.gov/articles/PMC2732137/ <br />
9. https://diabetesjournals.org/care/article/48/Supplement_1/S86/157563/5-Facilitating-Positive-Health-Behaviors-and-Well <br />
