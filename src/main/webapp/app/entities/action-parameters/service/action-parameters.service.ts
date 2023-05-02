import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActionParameters, NewActionParameters } from '../action-parameters.model';

export type PartialUpdateActionParameters = Partial<IActionParameters> & Pick<IActionParameters, 'id'>;

export type EntityResponseType = HttpResponse<IActionParameters>;
export type EntityArrayResponseType = HttpResponse<IActionParameters[]>;

@Injectable({ providedIn: 'root' })
export class ActionParametersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/action-parameters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(actionParameters: NewActionParameters): Observable<EntityResponseType> {
    return this.http.post<IActionParameters>(this.resourceUrl, actionParameters, { observe: 'response' });
  }

  update(actionParameters: IActionParameters): Observable<EntityResponseType> {
    return this.http.put<IActionParameters>(
      `${this.resourceUrl}/${this.getActionParametersIdentifier(actionParameters)}`,
      actionParameters,
      { observe: 'response' }
    );
  }

  partialUpdate(actionParameters: PartialUpdateActionParameters): Observable<EntityResponseType> {
    return this.http.patch<IActionParameters>(
      `${this.resourceUrl}/${this.getActionParametersIdentifier(actionParameters)}`,
      actionParameters,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActionParameters>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActionParameters[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActionParametersIdentifier(actionParameters: Pick<IActionParameters, 'id'>): number {
    return actionParameters.id;
  }

  compareActionParameters(o1: Pick<IActionParameters, 'id'> | null, o2: Pick<IActionParameters, 'id'> | null): boolean {
    return o1 && o2 ? this.getActionParametersIdentifier(o1) === this.getActionParametersIdentifier(o2) : o1 === o2;
  }

  addActionParametersToCollectionIfMissing<Type extends Pick<IActionParameters, 'id'>>(
    actionParametersCollection: Type[],
    ...actionParametersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const actionParameters: Type[] = actionParametersToCheck.filter(isPresent);
    if (actionParameters.length > 0) {
      const actionParametersCollectionIdentifiers = actionParametersCollection.map(
        actionParametersItem => this.getActionParametersIdentifier(actionParametersItem)!
      );
      const actionParametersToAdd = actionParameters.filter(actionParametersItem => {
        const actionParametersIdentifier = this.getActionParametersIdentifier(actionParametersItem);
        if (actionParametersCollectionIdentifiers.includes(actionParametersIdentifier)) {
          return false;
        }
        actionParametersCollectionIdentifiers.push(actionParametersIdentifier);
        return true;
      });
      return [...actionParametersToAdd, ...actionParametersCollection];
    }
    return actionParametersCollection;
  }
}
