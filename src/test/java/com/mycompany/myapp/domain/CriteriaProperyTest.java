package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CriteriaProperyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CriteriaPropery.class);
        CriteriaPropery criteriaPropery1 = new CriteriaPropery();
        criteriaPropery1.setId(1L);
        CriteriaPropery criteriaPropery2 = new CriteriaPropery();
        criteriaPropery2.setId(criteriaPropery1.getId());
        assertThat(criteriaPropery1).isEqualTo(criteriaPropery2);
        criteriaPropery2.setId(2L);
        assertThat(criteriaPropery1).isNotEqualTo(criteriaPropery2);
        criteriaPropery1.setId(null);
        assertThat(criteriaPropery1).isNotEqualTo(criteriaPropery2);
    }
}
