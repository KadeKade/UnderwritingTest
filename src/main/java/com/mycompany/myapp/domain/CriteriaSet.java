package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A CriteriaSet.
 */
@Entity
@Table(name = "criteria_set")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CriteriaSet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "insurer_id")
    private Long insurerId;

    @Column(name = "lob_id")
    private Long lobId;

    @OneToMany(mappedBy = "criterias")
    @JsonIgnoreProperties(value = { "criterias" }, allowSetters = true)
    private Set<Criteria> criteria = new HashSet<>();

    @ManyToOne
    private AutomatedAction automatedAction;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CriteriaSet id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public CriteriaSet name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getInsurerId() {
        return this.insurerId;
    }

    public CriteriaSet insurerId(Long insurerId) {
        this.setInsurerId(insurerId);
        return this;
    }

    public void setInsurerId(Long insurerId) {
        this.insurerId = insurerId;
    }

    public Long getLobId() {
        return this.lobId;
    }

    public CriteriaSet lobId(Long lobId) {
        this.setLobId(lobId);
        return this;
    }

    public void setLobId(Long lobId) {
        this.lobId = lobId;
    }

    public Set<Criteria> getCriteria() {
        return this.criteria;
    }

    public void setCriteria(Set<Criteria> criteria) {
        if (this.criteria != null) {
            this.criteria.forEach(i -> i.setCriterias(null));
        }
        if (criteria != null) {
            criteria.forEach(i -> i.setCriterias(this));
        }
        this.criteria = criteria;
    }

    public CriteriaSet criteria(Set<Criteria> criteria) {
        this.setCriteria(criteria);
        return this;
    }

    public CriteriaSet addCriteria(Criteria criteria) {
        this.criteria.add(criteria);
        criteria.setCriterias(this);
        return this;
    }

    public CriteriaSet removeCriteria(Criteria criteria) {
        this.criteria.remove(criteria);
        criteria.setCriterias(null);
        return this;
    }

    public AutomatedAction getAutomatedAction() {
        return this.automatedAction;
    }

    public void setAutomatedAction(AutomatedAction automatedAction) {
        this.automatedAction = automatedAction;
    }

    public CriteriaSet automatedAction(AutomatedAction automatedAction) {
        this.setAutomatedAction(automatedAction);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CriteriaSet)) {
            return false;
        }
        return id != null && id.equals(((CriteriaSet) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CriteriaSet{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", insurerId=" + getInsurerId() +
            ", lobId=" + getLobId() +
            "}";
    }
}
