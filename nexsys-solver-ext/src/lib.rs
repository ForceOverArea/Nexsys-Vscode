use wasm_bindgen::prelude::*;
use nexsys::solver::Nexsys;
use nexsys::parsing::{compile, domains, guess_values};

#[wasm_bindgen]
pub fn live_solve(code: &str) -> String {
    match compile(code) {
        Err(e) => e.to_string(),
        Ok(nil) => {
            let mut solver = Nexsys::new(&nil, 1E-10, 300, false);
            solver.mass_add_domains(domains(&nil));
            solver.mass_add_guess(guess_values(&nil));
            match solver.solve() {
                Err(e) => e.to_string(),
                Ok(o) => {

                    let mut soln_html = vec![];
                    let mut  log_html = vec![];

                    for (k, v) in o.0 {
                        let vf64 = v.as_f64();
                        soln_html.push(
                            format!(
"<tr>
    <td>{k}</td> <td>{vf64}</td>
</tr>"
                            )
                        );
                    }

                    for step in o.1 {
                        log_html.push(
                            format!("<p><strong>{step}</strong></p>")
                        );
                    }

                    let soln = format!("<table>{}</table>", soln_html.join("\n"));
                    let log  = log_html.join("\n");
                    
                    format!("{soln}<!---->{log}<!---->{nil}")
                }
            }
        }
    }
}